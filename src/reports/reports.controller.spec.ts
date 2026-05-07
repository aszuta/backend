import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

describe('ReportsController', () => {
  let controller: ReportsController;

  const mockReportsService = {
    sendReport: jest.fn(),
  };

  beforeEach(async () => {
    mockReportsService.sendReport.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call reportsService.sendReport with dto', async () => {
    const dto: CreateReportDto = {
      cityId: 'warszawa',
      description: 'Pogoda dla Warszawy wygląda niepoprawnie.',
    };

    const mockResult = {
      success: true,
      message: 'Zgłoszenie zostało przyjęte i wysłane.',
    };

    mockReportsService.sendReport.mockResolvedValue(mockResult);

    const result = await controller.sendReport(dto);

    expect(mockReportsService.sendReport).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  it('should call reportsService.sendReport without cityId', async () => {
    const dto: CreateReportDto = {
      description: 'Ogólny problem z aplikacją.',
    };

    const mockResult = {
      success: true,
      message: 'Zgłoszenie zostało przyjęte i wysłane.',
    };

    mockReportsService.sendReport.mockResolvedValue(mockResult);

    const result = await controller.sendReport(dto);

    expect(mockReportsService.sendReport).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });
});
