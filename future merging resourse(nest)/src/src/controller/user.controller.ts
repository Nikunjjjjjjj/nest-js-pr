import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { ApproveDto, CreateUserDto, LoginUserDto, UpdateUserDto } from "../dto/user.dto";
import commonUtil from "../utils/common.util";
import { Response, Request } from 'express';
import { AuthService } from "src/service/auth.service";
import { Roles } from "src/decorator/role.decorator";
import { RolesGuard } from "src/guard/role.guard";



@Controller('user')
@UseGuards(RolesGuard)
export class UserController{
    constructor(private readonly userService: UserService,
                private readonly authService: AuthService
    ){}

   
  @Post('register')
  //  @Roles('1')
  @UsePipes(new ValidationPipe())
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    ): Promise<any> {
      try {
        commonUtil.consoleLog('UserController:registerUser:start');
        const lastUser = await this.userService.findLastUserId();
  
        let newUserId = 1;
        if (lastUser) {
          newUserId = lastUser.id + 1;
        }
        const dataToCreate = {
          ...createUserDto,
          id: newUserId,
        };
        const newUser = await this.userService.createUser(dataToCreate);

        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({
          message: 'User registered successfully',
          user: {
            UID: newUser.UID,
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        });
      } catch (error) {
        commonUtil.consoleLog('UserController:RegisterUser:error', error);
        return res.status(500).json({
          message: 'Unable to update user',
    
        });
      }
  }
  
  @Post('login')
  async login(
  @Body() loginUserDto: LoginUserDto,
  @Res() res: Response,
  ): Promise<any> {
    try {
      const user = await this.userService.findUserByEmail(loginUserDto.email);
      //console.log('User:', user);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }  
        // Verify the password
      const isPasswordValid = await this.authService.compareUserPassword(
        loginUserDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }
      const token = this.authService.generateJWTToken(
       { 
        id: user.id,
        email: user.email,
        role: user.role,
        });
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      commonUtil.consoleLog('UserController:login:error', error);
      return res.status(500).json({
        message: 'Unable to fetch user',
      });
    }
  }
   
  @Get()
  @Roles(0)
  async getAllUsers(
    @Query() query: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      //const query = {}
      commonUtil.consoleLog('UserController:getAllUsers:start');
      const result = await this.userService.getUsers(query);
      commonUtil.consoleLog('UserController:getAllUsers:end', { result });
      return res.status(200).json(result);
    } catch (error) {
              commonUtil.consoleLog('UserController:getUserById:error', error);
              return res.status(500).json({
                message: 'Unable to fetch user',
              });
      }
  }

  @Get(':id')
  @Roles(0)
  async getUser(
    @Param('id') id: number,
    @Res() res: Response
    ): Promise<any>{
      try{
        commonUtil.consoleLog('UserController:getAllUser:start');
        const user = await this.userService.getUserById(id);
        commonUtil.consoleLog('UserController:getUserById:end', user);
        return res.status(200).json(user);
        } catch (error) {
        commonUtil.consoleLog('UserController:getUserById:error', error);
        return res.status(500).json({
            message: 'Unable to fetch user',
          });            }
  }
    
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response
    ): Promise<any>{
      try{
        commonUtil.consoleLog(`UserController:updateUser:start for ID: ${id}`);
        const user = await this.userService.getUserById(id);
      
        if (!user) {
          commonUtil.consoleLog('UserController:updateUser:user not found', id);
          return res.status(404).json({
            message: 'User not found',
            });
          }
            // Update the user with the provided data
          const updatedUser = await this.userService.updateUser(id, updateUserDto);
          commonUtil.consoleLog('UserController:updateUser:end', updatedUser);
          return res.status(200).json(updatedUser);
          } catch (e) {
            commonUtil.consoleLog('UserController:updateUser:error', e);
            return res.status(500).json({
              message: 'Unable to update user',
              
          });
        }
  }

  @Delete(':id')
  @Roles(0)
  @UsePipes(new ValidationPipe())
  async deleteUser(
    @Param('id') id: number,
    @Res() res: Response
  ): Promise<any>{{}
    try{
     commonUtil.consoleLog(`UserController:deleteUser:start for ID: ${id}`);
     const user = await this.userService.getUserById(id);
      if (!user) {
        commonUtil.consoleLog('UserController:deleteUser:user not found', id);
        return res.status(404).json({
          message: 'User not found',
        });
      }
          await this.userService.deleteUser(id);
          commonUtil.consoleLog('UserController:deleteUser:end');
          return res.status(200).json({
            message: 'User deleted successfully',
          });
          } catch (e) {{}
            commonUtil.consoleLog('UserController:deleteUser:error', e);
            return res.status(500).json({
              message: 'Unable to delete user',
            });
          }
  }

  @Put(':id')
  @Roles(0)
  @UsePipes(new ValidationPipe())
  async approveStatus(
    @Param('id') id: number,
    @Body() approveDto: ApproveDto,
    @Res() res: Response
  ): Promise<any>{
    try{
      commonUtil.consoleLog(`UserController:approveStatus:start for ID: ${id}`);
      const user = await this.userService.getUserById(id);
      if (!user) {
        commonUtil.consoleLog('UserController:deleteUser:user not found', id);
        return res.status(404).json({
          message: 'User not found',
        });
      }
      await this.userService.updateStatus(id, approveDto)
      commonUtil.consoleLog('UserController:approveStatus:end');
            return res.status(200).json({
              message: 'User deleted successfully',
            });
          } catch (e) {
            commonUtil.consoleLog('UserController:approveStatus:error', e);
            return res.status(500).json({
              message: 'Unable to delete user',             
            });
          }
  }
}
