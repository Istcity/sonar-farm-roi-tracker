export type ForecastDay = {
  date: string;
  tempMinC: number;
  tempMaxC: number;
  precipitationChance: number;
};

export type WeatherSnapshot = {
  locationName: string;
  temperatureC: number;
  humidity: number;
  windKmh: number;
  precipitationChance: number;
  updatedAt: string;
  forecast30d?: ForecastDay[];
};
