
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateUserDto{
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  role: boolean

}