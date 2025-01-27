import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class File{

    @Prop({required:true})
    playerId:string;

    @Prop()
    uploadedBy:string;

    @Prop()
    healthStatics:[]

    // @Prop()
    // error:[]
}
export const FileSchema= SchemaFactory.createForClass(File);