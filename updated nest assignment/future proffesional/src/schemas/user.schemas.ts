import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MaxLength, MinLength } from "@nestjs/class-validator";
import { UserRole, UserStatus } from "src/constraints/user.constraint";

@Schema({timestamps :true})
export class User{
  // @Prop({ required: true, unique: true })
  // id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: number;

  @Prop({ required: true })
  @MinLength(4)
  @MaxLength(50)
  password: string;

  @Prop({ type: Boolean, enum: [UserRole.ADMIN, UserRole.USER], default: UserRole.USER }) 
  role: Boolean;

  @Prop({ type: Boolean, enum: [UserStatus.ACTIVE, UserStatus.PENDING], default: UserStatus.PENDING })
  status: Boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);