import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateSaleDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  partnerId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;
}
