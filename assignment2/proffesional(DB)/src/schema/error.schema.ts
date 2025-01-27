import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ErrorDocument = HydratedDocument<ErrorSchena>;

@Schema({ timestamps: true})

export class ErrorSchena{

    @Prop({ required: true})
    uploadId: string

    @Prop({ type: String, required: true })
    fileName: string;

    @Prop({ type: String, required: true })
    errorMessage:string;

    @Prop({ type: Object, required: true })
    failedRecord:Object;

}
export const ErrorsSchema = SchemaFactory.createForClass(ErrorSchena);
