import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class Error{

    @Prop({required:true})
    playerId:string;

    @Prop()
    uploadedBy:string;

    @Prop()
    errorInData:[]
}
export const ErrorSchema= SchemaFactory.createForClass(Error);