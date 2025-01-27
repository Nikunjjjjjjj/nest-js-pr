import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ImportDataDto{

   // @IsNotEmpty()
    @IsString()
    name: string;

   // @IsNotEmpty()
    @IsEmail()
    email: string;

   // @IsNotEmpty()
    @IsNumber()
    phone: number;

    @IsString()
    @IsOptional()
    dob: string;

   // @IsString()
    @IsOptional()
    address: string;

}

export class UpdateFileDto{

    @IsString()
    @IsOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsNumber()
    @IsOptional()
    phone: number;

    @IsString()
    @IsOptional()
    dob: string;

    @IsString()
    @IsOptional()
    address: string;

}
