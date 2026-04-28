import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsString()
  cityId?: string;
}
