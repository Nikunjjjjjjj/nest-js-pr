import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor (@InjectModel(User.name) private readonly userSchema:Model<User>){}
  async create(createUserDto: CreateUserDto) {
    const haspassword= await bcrypt.hash(createUserDto.password,10)  //npm i --save-dev @types/bcrypt
    const result= await this.userSchema.create({...createUserDto,password:haspassword});
    return result.save();
  }

  async findbyEmail(Email:string){
    return await this.userSchema.findOne({email:Email});
  }


  async login(loginuserdto:LoginUserDto):Promise<Boolean>{
    const findUser=await this.findbyEmail(loginuserdto.email);
    console.log(findUser);
    
    return await bcrypt.compare(loginuserdto.password, findUser?.password);
  }

  async findAll() {
    return this.userSchema.find();
  }

  async getUserById (id){
    return this.userSchema.findOne({id});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
