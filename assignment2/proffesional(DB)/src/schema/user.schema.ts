import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MaxLength, MinLength } from 'class-validator';
import { UserRole } from 'src/dataTypes/user';

export type UserDocument = HydratedDocument<User>; 

@Schema({ timestamps: true })
export class User {

  @Prop({ unique: true, autoIncrement: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;

  @Prop({ enum: [UserRole.ADMIN, UserRole.USER], default: UserRole.USER }) 
  role: string;

   
}

export const UserSchema = SchemaFactory.createForClass(User);
