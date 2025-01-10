import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/services/auth.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService:AuthService
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    //console.log(createUserDto);
    
    return await this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get('login')
  async login(@Body() loginUserDto:LoginUserDto,
  @Res() res:Response
) {
    const result= await this.usersService.login(loginUserDto);
    //console.log(result);
    
    if (!result ){           
      return  res.status(404).json({message:"password didn't matched"});//throw new UnauthorizedException();
      
    }
    const user= await this.usersService.findbyEmail(loginUserDto.email)
    const token = await this.authService.generateToken({
      name:user.name,
      email:user.email,
      id:user._id
    })
//console.log(token);

    return res.status(200).json({message:` ${token}`});
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
