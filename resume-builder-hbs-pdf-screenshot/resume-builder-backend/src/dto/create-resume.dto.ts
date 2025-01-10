import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateResumeDto {
    @IsNotEmpty()
    userId:string;

    @IsNotEmpty()
    @IsString()
    personalinfo:string;

    @IsNotEmpty()
    @IsString()
    education:string;

    @IsNotEmpty()
    @IsString()
    skills:string;

    @IsNotEmpty()
    @IsNumber()
    phone:number;

    @IsNotEmpty()
    @IsString()
    jobTitle:string;

    @IsNotEmpty()
    @IsString()
    experience:string;
}
 