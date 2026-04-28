import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CitiesService } from '../cities/cities.service';
import { BulkWeatherDto } from './dto/bulk-weather.dto';
import { WeatherDetails } from './interfaces/weather-details.interface';
import { OpenWeatherResponse } from './interfaces/openweather-response.interface';

const OW_BASE = 'https://api.openweathermap.org/data/2.5/weather';

@Injectable()
export class WeatherService {
  constructor(private readonly citiesService: CitiesService) {}

  async getWeather(cityId: string): Promise<WeatherDetails> {
    const city = this.citiesService.findById(cityId);
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const { data } = await axios.get<OpenWeatherResponse>(OW_BASE, {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: apiKey,
        units: 'metric',
        lang: 'pl',
      },
    });
    return this.mapResponse(cityId, city.name, data);
  }

  async getBulkWeather(dto: BulkWeatherDto) {
    const results = await Promise.allSettled(
      dto.cityIds.map((id) => this.getWeather(id)),
    );
    return {
      data: results
        .filter(
          (r): r is PromiseFulfilledResult<WeatherDetails> =>
            r.status === 'fulfilled',
        )
        .map(({ value: w }) => ({
          cityId: w.cityId,
          cityName: w.cityName,
          temperature: w.temperature,
          description: w.description,
          icon: w.icon,
        })),
    };
  }

  private mapResponse(
    cityId: string,
    cityName: string,
    raw: OpenWeatherResponse,
  ): WeatherDetails {
    return {
      cityId,
      cityName,
      temperature: raw.main.temp,
      feelsLike: raw.main.feels_like,
      tempMin: raw.main.temp_min,
      tempMax: raw.main.temp_max,
      humidity: raw.main.humidity,
      pressure: raw.main.pressure,
      windSpeed: raw.wind.speed,
      windDirection: raw.wind.deg ?? 0,
      description: raw.weather[0].description,
      icon: raw.weather[0].icon,
      sunrise: raw.sys.sunrise,
      sunset: raw.sys.sunset,
      visibility: raw.visibility,
      updatedAt: new Date().toISOString(),
    };
  }
}
