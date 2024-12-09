import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(
   @InjectModel(User.name) private userSchema: Model<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userSchema(createUserDto);
    return await createdUser.save();
  }

  async findAll(query:any): Promise<any> {
    console.log(query);
    
  const {page = 1,limit=10,phone,email,name,role,status}=query
  console.log(name);
  
  const filters:any={};
  if (phone) filters.phone=phone;
  if (email) filters.email=email;
  if (name)filters.name=name;
  if (role) filters.role=Number(role)
  if (status) filters.status=Number(status)
    console.log(filters);
    const skip= (page-1)*limit
  
    const users= await this.userSchema.find(filters).skip(skip).limit(Number(limit));
   
    
    const totalusers = await this.userSchema.countDocuments(filters);
    return{
      totalusers,
      currentPage:page,
      limit:limit,
      users
    }
  }

  

  async findOne(id: number):Promise<User[]> {
    return await this.userSchema.findOne({id})
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser= await this.userSchema.findOneAndUpdate({id},updateUserDto,{new :true})
    return updatedUser.save();
  }

  async remove(id: number): Promise<User> {
    const deleteUser= await this.userSchema.findOneAndDelete({id});
    return deleteUser;
  }

  async findUserByEmail(email: string): Promise<any>{
    const user= await this.userSchema.findOne({email} );
    //console.log(user);
    
    return user;
  }
}
