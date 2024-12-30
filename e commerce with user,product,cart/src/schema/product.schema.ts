import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Product{
    @Prop({required:true})
    name:string;

    @Prop({required:true})
    description:string;

    @Prop({required:true})
    price:number;

    @Prop({default:"1"})
    quantity:number;

    @Prop({default:null})
    image_url:string;
}

export const ProductSchema= SchemaFactory.createForClass(Product);