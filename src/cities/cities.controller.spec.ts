import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { SearchCitiesDto } from './dto/search-cities.dto';

describe('CitiesController', () => {
  let controller: CitiesController;
  let citiesService: jest.Mocked<CitiesService>;

  const mockResult = {
    data: [
      {
        id: 'warszawa',
        name: 'Warszawa',
        lat: 52.2297,
        lon: 21.0122,
        voivodeship: 'Mazowieckie',
      },
    ],
    total: 1,
  };

  beforeEach(async () => {
    const mockCitiesService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: mockCitiesService,
        },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    citiesService = module.get(CitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call citiesService.findAll with default query values', () => {
    const query = new SearchCitiesDto();

    citiesService.findAll.mockReturnValue(mockResult);

    const result = controller.findAll(query);

    expect(citiesService.findAll).toHaveBeenCalledWith(undefined, 50);
    expect(result).toEqual(mockResult);
  });

  it('should call citiesService.findAll with q and limit', () => {
    const query: SearchCitiesDto = {
      q: 'war',
      limit: 5,
    };

    citiesService.findAll.mockReturnValue(mockResult);

    const result = controller.findAll(query);

    expect(citiesService.findAll).toHaveBeenCalledWith('war', 5);
    expect(result).toEqual(mockResult);
  });
});
