import { IsString, IsOptional, IsEmail, IsBoolean,  } from "@nestjs/class-validator";

export class UpdateUserDto{

    @IsString()
    @IsOptional()
    name: string;
  
    @IsEmail()
    @IsOptional()
    email: string;
  
    @IsString()
    @IsOptional()
    phone: string;
  
    @IsBoolean()
    @IsOptional()
    role: boolean;

  }
