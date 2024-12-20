import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Csv{
  @Prop({required:true})
  data:[];
}
//data:string;
export const CsvSchema= SchemaFactory.createForClass(Csv) ;