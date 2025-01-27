import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor (@InjectModel(User.name) public readonly userSchema:Model<User>){}

  async createnewuser(createUserDto: CreateUserDto) {
    const findUser=await this.findbyEmail(createUserDto.email);
    if(findUser){
      return error("email already in use,pls login")
    }
    const haspassword= await bcrypt.hash(createUserDto.password,10)  //npm i --save-dev @types/bcrypt
    const result= await this.userSchema.create({...createUserDto,password:haspassword});
    return result.save();
  }

  async findAll() {
    return await this.userSchema.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: number) {
    return await this.userSchema.deleteOne({_id:id});
  }

  async findbyEmail(Email:string){
    return await this.userSchema.findOne({email:Email});
  }
  async login(loginuserdto:LoginUserDto):Promise<Boolean>{
    const findUser=await this.findbyEmail(loginuserdto.email);

    return await bcrypt.compare(loginuserdto.password, findUser.password);
  }
}
