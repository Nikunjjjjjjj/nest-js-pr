import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCartTableDto {

    // @IsNotEmpty()
    // userid:string;

    // @IsNotEmpty()
    // productid:any;

    @IsOptional()
    @IsNumber()
    quantity:number;
}

export class EditCartDto{
    @IsNotEmpty()
    userid:string;

    @IsNotEmpty()
    productid:string;
}