import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class User{
    @Prop({required:true})
    name:string;

    @Prop({required:true})
    email:string;

    @Prop({required:true})
    password:string;
//verify
    @Prop({default:false})
    verifyed:boolean; 


    @Prop({default:false})
    primemember:boolean;
}

export const UserSchema= SchemaFactory.createForClass(User);