export interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg?: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  sys: {
    sunrise: number;
    sunset: number;
  };
  visibility: number;
}
