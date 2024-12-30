import { Injectable } from '@nestjs/common';
import { CreateCartTableDto, EditCartDto } from '../dto/create-cart_table.dto';
//import { UpdateCartTableDto } from '../dto/update-cart_table.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart_Table } from 'src/schema/cart_table.schema';
import { Model } from 'mongoose';
import { Product } from 'src/schema/product.schema';

//import { log } from 'console';

@Injectable()
export class CartTableService {
  constructor(@InjectModel(Cart_Table.name) private carttableSchema: Model<Cart_Table>,
    @InjectModel(Product.name) private productSchema: Model<Product>
){}


  //async addProductToCart(createCartTableDto: CreateCartTableDto):Promise<any> {
  async addProductToCart(userid,productid,createCartTableDto: CreateCartTableDto):Promise<any> {
    const { quantity}=createCartTableDto;
    //productid changed to any? and userid is running?

    const cart= await this.carttableSchema.findOne({userId:userid})
    //console.log(userid);
    //console.log(productid);
    //console.log(quantity);
    //console.log(cart);
    
    
    
   //user_id:createCartTableDto.userid
    if (cart){
        cart.items.push({productid:productid,...createCartTableDto})
        return await cart.save();
    }else{
      //console.log(createCartTableDto);
      //const itemcart=await new this.carttableSchema({ userid, items: [{productid, quantity} ] })
      //const itemcart=await this.carttableSchema.create({ userid:createCartTableDto.userid, items: [{ productid:createCartTableDto.productid, quantity:createCartTableDto.quantity }] })
      //const itemcart=await this.carttableSchema.create(createCartTableDto)
      const itemcart=await new this.carttableSchema({userId:userid,items:[{productid:productid,...createCartTableDto}]})
      return await itemcart.save();
    }
    //return await new this.carttableSchema(createCartTableDto).save();
  }

  //userid 
  async findAllItemsOfSingleUser(user_id:number):Promise<any>{
    return await this.carttableSchema.findOne({user_id});
    //.populate('items.productId');
  }

  async removefromcart(editCartDto:EditCartDto):Promise<any>{
    const { userid , productid}= editCartDto;
    const cart= this.carttableSchema.findOne({userid})   //:editCartDto.userid
    console.log(cart)
    if (cart){
      // cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      // return cart.save();
    }
    console.error("no cart found");
  }
//product id 
  async removeCart(id: number):Promise<any> {
    return await this.carttableSchema.findByIdAndDelete({id});
  }


  async placeOrderandPayment(cart_id:string){

    
    const cart= await this.carttableSchema.findById(cart_id);
    //console.log(cart.items);
    let payment=0;
    const pay =  cart.items.map(async(item)=>{
        //console.log(item.productid.toString());
        //console.log(item.quantity);
        const product = await this.productSchema.findById(item.productid)
        //console.log(product.price);
        payment = payment+product.price*item.quantity;
        //console.log(payment);
        
        return payment;
        
    })
    await Promise.all(pay);

    console.log(payment);
    //console.log(pay); //array return karega

    //const payment2= cart.items.reduce(async(arr,curr.productid)=>{    },0)//not working becauseof wrong default
    
    
    return `to pay at time of delivery ${payment} ,order placed success`; //now delete cart 


   
  }
}
  