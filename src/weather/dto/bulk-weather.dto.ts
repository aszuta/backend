import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class BulkWeatherDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cityIds: string[];
}
