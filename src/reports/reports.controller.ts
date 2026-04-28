import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(201)
  sendReport(@Body() dto: CreateReportDto) {
    return this.reportsService.sendReport(dto);
  }
}
