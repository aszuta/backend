import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { BulkWeatherDto } from './dto/bulk-weather.dto';
import { WeatherDetails } from './interfaces/weather-details.interface';

describe('WeatherController', () => {
  let controller: WeatherController;

  const mockWeatherService = {
    getWeather: jest.fn(),
    getBulkWeather: jest.fn(),
  };

  const mockWeatherDetails: WeatherDetails = {
    cityId: 'warszawa',
    cityName: 'Warszawa',
    temperature: 12.5,
    feelsLike: 10.1,
    tempMin: 9,
    tempMax: 14.2,
    humidity: 72,
    pressure: 1013,
    windSpeed: 5.2,
    windDirection: 240,
    description: 'zachmurzenie umiarkowane',
    icon: '04d',
    sunrise: 1714277040,
    sunset: 1714328580,
    visibility: 10000,
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockWeatherService.getWeather.mockReset();
    mockWeatherService.getBulkWeather.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call weatherService.getWeather with cityId', async () => {
    mockWeatherService.getWeather.mockResolvedValue(mockWeatherDetails);

    const result = await controller.getWeather('warszawa');

    expect(mockWeatherService.getWeather).toHaveBeenCalledWith('warszawa');
    expect(result).toEqual(mockWeatherDetails);
  });

  it('should call weatherService.getBulkWeather with dto', async () => {
    const dto: BulkWeatherDto = {
      cityIds: ['warszawa', 'krakow'],
    };

    const mockBulkResult = {
      data: [
        {
          cityId: 'warszawa',
          cityName: 'Warszawa',
          temperature: 12.5,
          description: 'zachmurzenie umiarkowane',
          icon: '04d',
        },
      ],
    };

    mockWeatherService.getBulkWeather.mockResolvedValue(mockBulkResult);

    const result = await controller.getBulkWeather(dto);

    expect(mockWeatherService.getBulkWeather).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockBulkResult);
  });
});
