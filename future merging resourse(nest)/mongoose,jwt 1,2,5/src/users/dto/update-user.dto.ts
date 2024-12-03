import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
  @IsString()
  @IsOptional()
  name: string;

  
  @IsEmail()
  @IsOptional()
  email: string;

  
  @IsOptional()
  phone: number;

  
  @IsString()
  @IsOptional()
  password: string;

  @IsBoolean()
  @IsOptional()
  role: boolean
}
