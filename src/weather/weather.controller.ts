import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { BulkWeatherDto } from './dto/bulk-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':cityId')
  getWeather(@Param('cityId') cityId: string) {
    return this.weatherService.getWeather(cityId);
  }

  @Post('bulk')
  getBulkWeather(@Body() dto: BulkWeatherDto) {
    return this.weatherService.getBulkWeather(dto);
  }
}
