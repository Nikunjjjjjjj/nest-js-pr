import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schema/user.schema";
import { Model } from "mongoose";
import {  CreateUserDto, ResetPasswordDto, UpdateRoleDto, UpdateUserDto } from "../dto/user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService{
  constructor(@InjectModel(User.name) private userSchema: Model<User>){}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);    
      const user = new this.userSchema({
        ...createUserDto,
        password: hashedPassword,
      });
    
      return user.save();
  }
    
  async findUserByEmail(email: string): Promise<any> {
    return this.userSchema.findOne({ email }).exec();
  }

  // async validateUser(email: string, password: string): Promise<any> {
  //     const user = await this.findUserByEmail(email);
    
  //     if (!user) {
  //       throw new UnauthorizedException('Invalid email or password');
  //     }
    
  //     const isPasswordValid = await bcrypt.compare(password, user.password);
  //     if (!isPasswordValid) {
  //       throw new UnauthorizedException('Invalid email or password');
  //     }
    
  //       return {
  //         id: user.id,
  //         email: user.email,
  //         name: user.name,
  //       };

  // }

  async findLastUserId(): Promise<any> {  
    return this.userSchema
    .findOne()
    .sort({ id: -1 }) // Sort by id in descending order
  }

  async getUserById(id: number): Promise<any>{
      const user = this.userSchema.findOne({ id })
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
   }

  //  async getUserById(id: string): Promise<any> {
  //   return this.userSchema.findOne({ UID: id }).exec();
  // }

    async getAllUser(): Promise<any>{
        const users = this.userSchema.find()
        return users;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<any> {
        const user = this.userSchema.findOneAndUpdate({ id }, updateUserDto, { new: true });
        return user;
      }

  async deleteUser(id: number): Promise<any> {
    const user = this.userSchema.deleteOne({ id });
      return user;

  }

  async updateUserStatus(id: number, status: number): Promise<any> {
    return this.userSchema.findOneAndUpdate({ id: id }, { status }, { new: true })
  }

  async getUsers(query: any): Promise<any> {
    const { page = 1, limit = 10, phone, name, email, role, status } = query;

    const filters: any = {};
    if (phone) filters.phone = phone;
    if (name) filters.name = { $regex: name, $options: 'i' }; // Case-insensitive    
    if (role) filters.role = Number(role)
    if (status) filters.status = Number(status);
    if (email) filters.email = email;

      //console.log('Filters applied:', filters);

    const skip = (page - 1) * limit;
    const users = await this.userSchema.find(filters).skip(skip).limit(Number(limit));

    const totalUsers = await this.userSchema.countDocuments(filters);
      return {
        totalUsers,
        page: page,
        limit: limit,
        users,
      }; 
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<User>{
    const user = await this.userSchema.findById(id);
       if (!user) {
         throw new NotFoundException(`User with ID ${id} not found`);
       }
       if(user.role === "Active" ){
         throw new Error('User is Already an Admin')
       }
       user.role = updateRoleDto.role;
       return await user.save();

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { email, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }    
    const user = await this.userSchema.findOne({ email }); 
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    return { message: 'Password reset successfully' };
  }

}