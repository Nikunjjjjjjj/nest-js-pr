import { IsBoolean, IsEmail, IsNotEmpty,IsNumber,IsOptional,IsString ,} from "@nestjs/class-validator";
import { IsEnum } from "class-validator";
import { UserStatus } from "src/constraints/user.constraint";

export class CreateUserDto {

    // @IsNotEmpty()
    // @IsNumber()
    // id:number;

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    phone:number;

    @IsNotEmpty()
    @IsString()
    password:string;

    @IsOptional()
    @IsBoolean()
    role: boolean;

    @IsOptional()
    @IsBoolean()
    status: boolean;
}


export class LoginUserDto{
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}

export class ApproveDto{
    @IsNotEmpty()
    @IsEnum(UserStatus)
    status: boolean;
}