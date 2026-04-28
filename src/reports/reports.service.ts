import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  async sendReport(
    dto: CreateReportDto,
  ): Promise<{ success: boolean; message: string }> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = dto.cityId
      ? `[WeatherApp] Zgłoszenie błędu – ${dto.cityId}`
      : '[WeatherApp] Zgłoszenie błędu';

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.REPORT_EMAIL,
      subject,
      text: dto.description,
    });

    return { success: true, message: 'Zgłoszenie zostało przyjęte i wysłane.' };
  }
}