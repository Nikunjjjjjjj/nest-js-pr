import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
//import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { Constants } from 'src/utils/user.constraints';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userSchema : Model<User>){}

  //constructor(@InjectModel(User.name) private userSchema=Model<User>){}
  async create(createUserDto: CreateUserDto): Promise<any> {
    const hashpassword= await bcrypt.hash(createUserDto.password,10)
    const user= await new this.userSchema({...createUserDto,password: hashpassword,role: Constants.ROLES.NORMAL_ROLE})
    return user.save();
  }

  findAll() {
    return `This action returns all users`;
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
