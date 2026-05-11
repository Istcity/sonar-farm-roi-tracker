export type WeatherRegionSeed = {
  key: string;
  countryCode: string;
  locationName: string;
  lat: number;
  lon: number;
};

// Starter set for shared daily weather snapshots.
// Expand this list over time as user footprint grows.
export const weatherRegionSeeds: WeatherRegionSeed[] = [
  { key: "TR-istanbul", countryCode: "TR", locationName: "Istanbul", lat: 41.01, lon: 28.97 },
  { key: "TR-ankara", countryCode: "TR", locationName: "Ankara", lat: 39.93, lon: 32.85 },
  { key: "TR-izmir", countryCode: "TR", locationName: "Izmir", lat: 38.42, lon: 27.14 },
  { key: "US-california", countryCode: "US", locationName: "California", lat: 36.77, lon: -119.42 },
  { key: "US-iowa", countryCode: "US", locationName: "Iowa", lat: 42.03, lon: -93.58 },
  { key: "BR-sao-paulo", countryCode: "BR", locationName: "Sao Paulo", lat: -23.55, lon: -46.63 },
  { key: "IN-punjab", countryCode: "IN", locationName: "Punjab", lat: 31.15, lon: 75.34 },
  { key: "ES-andalusia", countryCode: "ES", locationName: "Andalusia", lat: 37.39, lon: -5.99 },
  { key: "FR-occitanie", countryCode: "FR", locationName: "Occitanie", lat: 43.61, lon: 3.88 },
  { key: "DE-bavaria", countryCode: "DE", locationName: "Bavaria", lat: 48.79, lon: 11.50 },
];

