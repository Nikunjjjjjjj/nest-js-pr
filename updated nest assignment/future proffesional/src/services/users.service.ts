import { Injectable } from '@nestjs/common';
import { ApproveDto, CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schemas';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userSchema=Model<User>){}
  
  async create(createUserDto: CreateUserDto): Promise<any> {
    const hashpassword= await bcrypt.hash(createUserDto.password,10)
    //console.log(hashpassword);
    
    const user = await new this.userSchema({...createUserDto,password: hashpassword});
    return user.save();
  } 

  async findAll():Promise<any> {
    return await this.userSchema.find();
  }

  async findOne(id: string):Promise<any> {
    return await this.userSchema.findById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto):Promise<any> {
    return await this.userSchema.findByIdAndUpdate({id},updateUserDto,{new:true});
  }

  async remove(id: number): Promise<any> {
    return await this.userSchema.deleteOne({id});
  }

  async findByEmail(email: string):Promise<any>{
    return await this.userSchema.findOne({email})
  }

  async updateStatus(id :string, approveDto:ApproveDto):Promise<any>{
    const user= await this.userSchema.findById(id);
    console.log(user);
    user.status= approveDto.status;
    return user.save();
  }
}
