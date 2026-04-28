import { Module } from '@nestjs/common';
import { CitiesModule } from '../cities/cities.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [CitiesModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
