import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as mongooseSchema } from "mongoose";
import { User } from "./user.schema";

@Schema({timestamps:true})
export class Resume{
    @Prop({type:mongooseSchema.Types.ObjectId, ref:()=>User})
    userId: mongooseSchema.Types.ObjectId;

    @Prop({ref:()=>User,default:User.name})
    name:string;

    @Prop({default:null})
    email:string;

    
    @Prop({default:null})
    localPhotoPath:string;

    @Prop({default:1})
    templateId:number;

    @Prop({required:true})
    personalinfo:string;  //summary

    @Prop({required:true})
    education:string;

    @Prop({required:true})
    experience:string;

    // @Prop({required:true})
    // education:{
    //     degree:string,
    //     institution:string,
    //     startYear:number,
    //     endYear:number,
    // }[];

    // @Prop({default:null})
    // experience:{
    //     jobTitle:string,
    //     company:string,
    //     startYear:number,
    //     endYear:number,
    //     description:string
    // }[];

    @Prop({required:true})
    skills:string;

    @Prop({required:true})
    phone:number;

    @Prop({required:true})
    jobTitle:string;

}

export const ResumeSchema= SchemaFactory.createForClass(Resume);