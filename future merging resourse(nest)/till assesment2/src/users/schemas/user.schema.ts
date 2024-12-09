import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MaxLength, MinLength } from "class-validator";
import { UserRole } from "src/constraints/user.constraint";


@Schema({timestamps :true})
export class User{
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @Prop({ type: Boolean, enum: [UserRole.ADMIN, UserRole.USER], default: UserRole.USER }) 
  role: Boolean;

  @Prop({ default: 0 })
  status: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
