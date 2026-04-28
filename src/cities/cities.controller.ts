import { Controller, Get, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { SearchCitiesDto } from './dto/search-cities.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll(@Query() query: SearchCitiesDto) {
    return this.citiesService.findAll(query.q, query.limit);
  }
}
