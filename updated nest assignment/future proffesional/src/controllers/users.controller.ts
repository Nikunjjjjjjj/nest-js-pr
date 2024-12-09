import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Res, Put } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApproveDto, CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/services/auth.service';
import { Roles } from 'src/decorator/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response)
    : Promise<any> {
      try{

        const newUser= await this.usersService.create(createUserDto);
        return res.status(201).json({
      message: 'User registered successfully', 
      user: {
        //UID: newUser.UID,
        //id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch(error){
    return res.status(500).json({
      message:`unable to print ${error}`,
    })
  }
}
 
  @Get()
  @Roles(1)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('/api/:id')
  @Roles(1)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Put('/api/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param(':id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/api/:id')
  @UsePipes(new ValidationPipe())
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response): Promise<any>{
      try {
        const user= await this.usersService.findByEmail(loginUserDto.email)

        //console.log(user);
        const isPasswordValid = await this.authService.compareUserpassword(loginUserDto.password,user.password)
        //console.log(isPasswordValid);
        
        if( !isPasswordValid){
          return res.status(400).json({
            "message":"wrong Password",
          })
        
        }  

        const token = await this.authService.generateToken({
            name: user.name,
            email: user.email,
            role: user.role,
          })
          //console.log(token);
          
          return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
              name: user.name,
              email: user.email,
              role: user.role,
            }
          });
        }

       catch (error) {
        return res.status(500).json({
          message: 'Unable to fetch user',
        });
      }
    }


    @Put(':id')
    @Roles(1)
    @UsePipes(new ValidationPipe())
    async approveStatus(
      @Param('id')id: string,
      @Body ()approveDto: ApproveDto,
      @Res () res:Response,
    ): Promise<any>{
      try {
        
        //console.log(user);
        const a = await this.usersService.updateStatus(id,approveDto);
        return res.status(200).json({
          message: 'User status changed successfully',
        });
      } catch (error) {
        return res.status(500).json({
          message: 'Unable to update status',             
        });
      }
    }

}
