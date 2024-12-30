import { Prop, Schema , SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps:true})
export class User{
    @Prop({required:true})
    name:string;

    @Prop({required:true,unique:true})
    email:string;

    @Prop({required:true})
    password:string;

    @Prop({default:"Normal"})
    role:string;

    @Prop({default:null})
    shipping_address:string;
} 

export const UserSchema= SchemaFactory.createForClass(User) ;