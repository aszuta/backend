export interface WeatherDetails {
  cityId: string;
  cityName: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  visibility: number;
  updatedAt: string;
}
