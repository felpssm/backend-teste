import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum UserRole {
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
  CUSTOMER = "CUSTOMER",
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
