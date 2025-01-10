import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { Request, Response } from 'express';
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
  try {
    const result= await this.usersService.login(loginUserDto);
    //console.log(result);
    
    if (!result ){           
      return  res.status(404).json({message:"password didn't matched"});//throw new UnauthorizedException();
      
    }
    const user= await this.usersService.findbyEmail(loginUserDto.email)
    const verify= await this.usersService.verify(user._id);
    const up_user= await this.usersService.findbyEmail(loginUserDto.email)
    const token = await this.authService.generateToken({
      name:up_user.name,
      email:up_user.email,
      //verifyed:up_user.verifyed,
      id:up_user._id
    }) 
//console.log(token);

    return res.status(200).json({message:` ${token}`});
  } catch (error) {
    res.status(401).json(`error in login ${error}`);
  }
    
  } 

  @Post('logout/:id')
  async logout (@Param('id') id:number,
@Req() req:Request,
@Res() res:Response
){try {
  
  
  const user= await this.usersService.findOnebyId(id);
  //console.log(user);
  const user_check= await this.authService.authenticateUserWithToken(req.headers.authorization,user._id);
  const unverify = await this.usersService.logOUTverifyFalse(id);
  res.status(200).json('logout succesful')
} catch (error) {
  res.status(401).json(error)
}
  
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
