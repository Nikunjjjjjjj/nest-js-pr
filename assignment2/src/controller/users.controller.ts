import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/services/auth.service';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/decorator/role.decorator';


@Controller('users')
@UseGuards(RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authservice:AuthService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createnewuser(createUserDto);
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
    //console.log(user.role);
    
    const token= await this.authservice.generateToken({
      name:user.name,
      email:user.email,
      role:user.role,
      id:user._id
    })
    return res.status(200).json({'message':`${token}`})

  }

  @Get('api')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles("coach")
  findOne(@Param('id') id: string) {
    console.log(id);
    
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
  
  @Delete(':id')
  @Roles("coach")
  remove(@Param('id') id: number) {
    console.log(typeof(id));
    
    return this.usersService.remove(id);
  }
}
