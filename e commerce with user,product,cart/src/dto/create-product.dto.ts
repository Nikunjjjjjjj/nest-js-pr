import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name:string;
    
    @IsNotEmpty()
    @IsString()
    description:string;
    
    @IsNotEmpty()
    @IsNumber()
    price:number;
    
    @IsOptional()
    @IsNumber()
    quantity:number;
    
    @IsOptional()
    image_url:string;
}
