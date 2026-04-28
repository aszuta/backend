import { Injectable, NotFoundException } from '@nestjs/common';
import citiesData from '../../data/cities.json';
import { City } from './interfaces/city.interface';

@Injectable()
export class CitiesService {
  private readonly cities: City[] = citiesData as City[];

  findAll(q?: string, limit = 50): { data: City[]; total: number } {
    let result = this.cities;
    if (q) {
      const query = q.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(query));
    }
    return { data: result.slice(0, limit), total: result.length };
  }

  findById(id: string): City {
    const city = this.cities.find((c) => c.id === id);
    if (!city) throw new NotFoundException(`City '${id}' not found`);
    return city;
  }
}
