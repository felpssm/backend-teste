import { IsOptional, IsDateString, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class SalesReportQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  partnerId?: number;
}
