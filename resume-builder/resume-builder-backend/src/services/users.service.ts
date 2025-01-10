import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { error } from 'console';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userschema:Model<User>){}
  async create(createUserDto: CreateUserDto) {
    const find_user= await this.findbyEmail(createUserDto.email);
    //const find_user= await this.userschema.findOne({email:createUserDto.email})
    if (find_user ){
      console.log(createUserDto.email);
      console.log(typeof(find_user));
      
      return error("email is already in use");
    }
    const hashPassword= await bcrypt.hash(createUserDto.password,10)
    const result= new this.userschema({...createUserDto,password:hashPassword});
    return result.save();
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOnebyId(id:number){
    
    const result= await this.userschema.findOne({_id:id});
    
    
    return result;
  }
  async findbyEmail(Email:string){
    return await this.userschema.findOne({email:Email})
  }

  async login(loginUserDto:LoginUserDto):Promise<boolean> {
    const find_user= await this.findbyEmail(loginUserDto.email)
    //console.log(find_user);
   
    return await bcrypt.compare(loginUserDto.password,find_user.password);
  }

  async verify (id:any){
    const update_user= (await this.userschema.findByIdAndUpdate(id,{verifyed:true})).save()
    return update_user;
  }

  async logOUTverifyFalse (id:any){
    const update_user= (await this.userschema.findByIdAndUpdate(id,{verifyed:false})).save()
    return update_user;
  }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
