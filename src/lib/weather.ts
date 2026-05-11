import AsyncStorage from "@react-native-async-storage/async-storage";
import { ForecastDay, WeatherSnapshot } from "../types/weather";
import { weatherRegionSeeds } from "../data/weatherRegions";

type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    relativehumidity_2m: number;
    windspeed_10m: number;
    precipitation_probability: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

function extendTo30Days(base: ForecastDay[]): ForecastDay[] {
  if (base.length >= 30) return base.slice(0, 30);
  if (base.length === 0) return [];
  const out = [...base];
  while (out.length < 30) {
    const prev = out[out.length - 1];
    const ref = out[Math.max(0, out.length - 7)];
    const nextDate = new Date(prev.date);
    nextDate.setDate(nextDate.getDate() + 1);
    const drift = ((out.length % 6) - 3) * 0.15;
    out.push({
      date: nextDate.toISOString().slice(0, 10),
      tempMinC: Math.round((ref.tempMinC + drift) * 10) / 10,
      tempMaxC: Math.round((ref.tempMaxC + drift) * 10) / 10,
      precipitationChance: Math.max(0, Math.min(100, Math.round((ref.precipitationChance + 1) * 10) / 10)),
    });
  }
  return out;
}

const WEATHER_CACHE_PREFIX = "sonar-weather-daily-v1";
const SHARED_WEATHER_URL =
  "https://raw.githubusercontent.com/sonar-farm-roi/datasets/main/weather-daily.json";

const bucketCoord = (value: number) => Math.round(value * 10) / 10;

const regionDailyKey = (countryCode: string, lat: number, lon: number, dayKey: string): string =>
  `${WEATHER_CACHE_PREFIX}:${countryCode}:${bucketCoord(lat)}:${bucketCoord(lon)}:${dayKey}`;

const resolveRegionSeedKey = (countryCode: string, lat: number, lon: number): string | null => {
  const cc = countryCode.toUpperCase();
  const sameCountry = weatherRegionSeeds.filter((s) => s.countryCode === cc);
  if (sameCountry.length === 0) return null;
  let best = sameCountry[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const seed of sameCountry) {
    const dLat = seed.lat - lat;
    const dLon = seed.lon - lon;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < bestDist) {
      best = seed;
      bestDist = dist;
    }
  }
  return best.key;
};

type SharedDailyPayload = {
  dayKey: string;
  generatedAt: string;
  regions: Record<string, WeatherSnapshot>;
};

async function fetchSharedDailyWeather(regionKey: string, dayKey: string): Promise<WeatherSnapshot | null> {
  try {
    const res = await fetch(`${SHARED_WEATHER_URL}?v=${dayKey}`);
    if (!res.ok) return null;
    const payload = (await res.json()) as SharedDailyPayload;
    if (payload.dayKey !== dayKey) return null;
    return payload.regions?.[regionKey] || null;
  } catch {
    return null;
  }
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  locationName: string,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relativehumidity_2m,windspeed_10m,precipitation_probability",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    forecast_days: "16",
    windspeed_unit: "kmh",
    timezone: "auto",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) throw new Error("Open-Meteo request failed");

  const data = (await response.json()) as OpenMeteoResponse;
  const forecastBase: ForecastDay[] = data.daily.time.map((date, i) => ({
    date,
    tempMinC: Math.round(data.daily.temperature_2m_min[i]),
    tempMaxC: Math.round(data.daily.temperature_2m_max[i]),
    precipitationChance: Math.round(data.daily.precipitation_probability_max[i]),
  }));

  return {
    locationName,
    temperatureC: Math.round(data.current.temperature_2m),
    humidity: Math.round(data.current.relativehumidity_2m),
    windKmh: Math.round(data.current.windspeed_10m),
    precipitationChance: Math.round(data.current.precipitation_probability),
    updatedAt: new Date().toISOString(),
    forecast30d: extendTo30Days(forecastBase),
  };
}

export async function getDailyWeatherByRegion(
  lat: number,
  lon: number,
  locationName: string,
  countryCode: string,
): Promise<WeatherSnapshot> {
  const cc = (countryCode || "UN").toUpperCase();
  const dayKey = new Date().toISOString().slice(0, 10);
  const cacheKey = regionDailyKey(cc, lat, lon, dayKey);

  try {
    const cachedRaw = await AsyncStorage.getItem(cacheKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as WeatherSnapshot;
      if (cached?.updatedAt) return cached;
    }
  } catch {
    // Ignore parse/cache errors and continue with fresh fetch.
  }

  const sharedRegionKey = resolveRegionSeedKey(cc, lat, lon);
  if (sharedRegionKey) {
    const shared = await fetchSharedDailyWeather(sharedRegionKey, dayKey);
    if (shared) {
      try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(shared));
      } catch {
        // Ignore cache write errors.
      }
      return { ...shared, locationName };
    }
  }

  const fresh = await fetchWeatherByCoords(lat, lon, locationName);
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(fresh));
  } catch {
    // Ignore cache write errors.
  }
  return fresh;
}
