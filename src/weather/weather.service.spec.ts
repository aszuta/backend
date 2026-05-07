import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WeatherService } from './weather.service';
import { CitiesService } from '../cities/cities.service';

jest.mock('axios');
const mockedAxios = axios;

const MOCK_OW_RESPONSE = {
  main: {
    temp: 12.5,
    feels_like: 10.1,
    temp_min: 9.0,
    temp_max: 14.2,
    humidity: 72,
    pressure: 1013,
  },
  wind: { speed: 5.2, deg: 240 },
  weather: [{ description: 'zachmurzenie umiarkowane', icon: '04d' }],
  sys: { sunrise: 1714277040, sunset: 1714328580 },
  visibility: 10000,
};

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        CitiesService,
        { provide: ConfigService, useValue: { get: () => 'test-api-key' } },
      ],
    }).compile();
    service = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return weather details for valid city', async () => {
    mockedAxios.get = jest.fn().mockResolvedValue({ data: MOCK_OW_RESPONSE });
    const result = await service.getWeather('warszawa');
    expect(result.cityId).toBe('warszawa');
    expect(result.cityName).toBe('Warszawa');
    expect(result.temperature).toBe(12.5);
    expect(result.humidity).toBe(72);
  });

  it('should throw NotFoundException for unknown city', async () => {
    await expect(service.getWeather('unknown-city')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return partial results in bulk when one city fails', async () => {
    mockedAxios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: MOCK_OW_RESPONSE })
      .mockRejectedValueOnce(new Error('Network error'));
    const result = await service.getBulkWeather({
      cityIds: ['warszawa', 'krakow'],
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].cityId).toBe('warszawa');
  });
});
