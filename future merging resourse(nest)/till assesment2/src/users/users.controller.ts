import { Controller, Get, Post, Body, Patch, Param, Delete, Res, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
//import { AuthService } from 'src/users/auth.service';
import { AuthService } from './auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response): Promise<any>{
    const user= await this.usersService.findUserByEmail(loginDto.email);
    //console.log(user);
    // const isPasswordValid = await this.authService.compareUserPassword(
    //   loginDto.password,
    //   user.password,
    // );
    // console.log(loginDto.password);
    // console.log(user.password);
    
    // console.log(isPasswordValid);
    
    if (user.password != loginDto.password) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
  });
  }
}
