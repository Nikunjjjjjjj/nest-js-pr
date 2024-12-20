import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Excel{
  @Prop({required:true})
  data:[];
}
//data:string;
export const ExcelSchema= SchemaFactory.createForClass(Excel) ;