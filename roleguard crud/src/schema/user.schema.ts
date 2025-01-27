import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "src/datatypes/user";
//import { UserRole } from "src/datatypes/user";
@Schema({timestamps:true})
export class User {
    @Prop({required:true})
    name:string;

    @Prop({required:true})
    email:string;

    @Prop({required: true})
    password:string;

    @Prop({required:true})
    sports:string;

    @Prop({enum:[UserRole.COACH,UserRole.PLAYER], default: UserRole.PLAYER})
    role:string;

    @Prop({default:18})
    age:number
}

export const UserSchema= SchemaFactory.createForClass(User);