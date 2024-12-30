import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartTableService } from '../services/cart_table.service';
import { CreateCartTableDto, EditCartDto } from '../dto/create-cart_table.dto';


@Controller('cart-table')
export class CartTableController {
  constructor(private readonly cartTableService: CartTableService) {}

  @Post("/:userid/:productid")
  AddProductToCart(
    @Param('userid') userid:string,
    @Param('productid') productid:string,
    @Body()  createCartTableDto:CreateCartTableDto) {
    return this.cartTableService.addProductToCart(userid,productid,createCartTableDto);
  }
//@Body() createCartTableDto: CreateCartTableDto
  @Get(':user_id')
  FindAllItemsOfSingleUser(@Param('user_id') user_id: number) {
    return this.cartTableService.findAllItemsOfSingleUser(user_id);
  }
  
  @Delete('remove')
  removefromcart(@Body() editCartDto:EditCartDto){
    return this.cartTableService.removefromcart(editCartDto);
  }


  @Delete('api/:id')
  removeCart(@Param('id') id: number) {
    return this.cartTableService.removeCart(id);
  }

  //make payment and place order
  @Get('placeorder/:cart_id')
  placeOrderAndPaymentInfo(@Param('cart_id') cart_id: string){
    //console.log("working");
    
    return this.cartTableService.placeOrderandPayment(cart_id);
  }
}
