import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CitiesService } from './cities.service';

describe('CitiesService', () => {
  let service: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitiesService],
    }).compile();
    service = module.get<CitiesService>(CitiesService);
  });

  it('should return all cities when no query', () => {
    const result = service.findAll();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it('should filter cities by name (case-insensitive)', () => {
    const result = service.findAll('war');
    expect(result.data.every((c) => c.name.toLowerCase().includes('war'))).toBe(
      true,
    );
  });

  it('should respect the limit parameter', () => {
    const result = service.findAll(undefined, 5);
    expect(result.data.length).toBeLessThanOrEqual(5);
  });

  it('should return empty array when no match', () => {
    const result = service.findAll('xyzxyzxyz');
    expect(result.data).toHaveLength(0);
  });

  it('should find city by id', () => {
    const city = service.findById('warszawa');
    expect(city.name).toBe('Warszawa');
    expect(city.lat).toBeCloseTo(52.2297, 3);
  });

  it('should throw NotFoundException for unknown id', () => {
    expect(() => service.findById('unknown')).toThrow(NotFoundException);
  });
});
