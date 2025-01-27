import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "src/dataTypes/user";

export class CreateUserDto{
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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;

  @IsEnum(UserRole, {message: 'Role must be either "Admin" or "Student" '})
  @IsNotEmpty()
  role: string
}

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
  
    @IsString()
    @IsOptional()
    password: string;
  }

export class LoginUserDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

// export class ApproveDto{  
//   @IsNotEmpty()
//   @IsBoolean()
//   @IsEnum(UserStatus, { message: 'Status must be either PENDING (0) or ACTIVE (1)' })
//   status: boolean; 
// }


export class UpdateRoleDto{
  
  @IsEnum(UserRole, {message: 'Role must be either "Admin" or "Student" '})
  @IsNotEmpty()
  role: string
}

export class ResetPasswordDto{
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  confirmPassword: string;
}