import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/service/auth.service';
import { RolesGuard } from 'src/guards/role.guards';
import { Roles } from 'src/decorator/role.decorator';


@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authservice:AuthService
  ) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
 
  @Get('login')
  async login(@Body() loginuserdto:LoginUserDto,
@Res() res:Response
){
    const login= await this.usersService.login(loginuserdto);
    if (!login){
      return  res.status(404).json({message:"password didn't matched"});
    }
    const user= await this.usersService.findbyEmail(loginuserdto.email);
    const token= await this.authservice.generateToken({
      name:user?.name,
      email:user?.email,
      role:user?.role,
      id:user?._id
    })
    return res.status(200).json({'message':`${token}`})

  }


  @Roles('coach')
  @Get('api')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
