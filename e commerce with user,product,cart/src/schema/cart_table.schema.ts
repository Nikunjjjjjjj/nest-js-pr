import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MoongooseSchema } from "mongoose";
import { User } from "./user.schema";
import { Product } from "./product.schema";

@Schema()
export class Cart_Table{
    @Prop({type:MoongooseSchema.Types.ObjectId, ref :()=>{User}})
    userId: MoongooseSchema.Types.ObjectId;

//     @Prop({
//     productId:{type:MoongooseSchema.Types.ObjectId, ref :()=>{Product}}
//     }
// )
//     product: MoongooseSchema.Types.ObjectId;

//     @Prop({default:"1"})
//     quantity:number;
//MoongooseSchema.Types.ObjectId, ref :()=>{Product}
    @Prop([
        {
        productid: { type: MoongooseSchema.Types.ObjectId, ref :()=>{Product} },
        quantity: { type: Number, default : 1 },
        },
    ])
    items: {
        productid: MoongooseSchema.Types.ObjectId;
        quantity: number;
    }[];
}

export const Cart_TableSchema= SchemaFactory.createForClass(Cart_Table);