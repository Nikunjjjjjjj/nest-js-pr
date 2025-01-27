import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FileDataDocument = HydratedDocument<FileData>;

@Schema({ timestamps:true})
export class FileData{

    @Prop()
    uploadId: string;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    dob: string;

    @Prop()
    address: string;

    @Prop()
    studentPhoto: string; 

}

export const FileDataSchema = SchemaFactory.createForClass(FileData);