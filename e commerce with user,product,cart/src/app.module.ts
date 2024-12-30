import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import  Config  from './configs';
import { User, UserSchema } from './schema/user.schema';
import { Product, ProductSchema } from './schema/product.schema';
import { Cart_Table, Cart_TableSchema } from './schema/cart_table.schema';
import { UsersController } from './controllers/users.controller';
import { ProductsController } from './controllers/products.controller';
import { CartTableController } from './controllers/cart_table.controller';
import { UsersService } from './services/users.service';
import { ProductsService } from './services/products.service';
import { CartTableService } from './services/cart_table.service';

@Module({
  imports: [
    MongooseModule.forRoot(Config.MONGO_URI,{
      connectionFactory:(connection) =>{
        connection.on("connected",()=>{
          console.log("mongoose is connected");
          
        });
        connection.on('disconnected', () => {
          console.log('MongooseModule DB disconnected');
        });
        
        connection.on('error', (error: any) => {
          console.log(
            'MongooseModule DB connection failed! for error: ',
            error,
          );
        });
        return connection;  
      },
    }),
    MongooseModule.forRoot('mongodb://localhost/ecommerce_db'),
    MongooseModule.forFeature([{name:User.name, schema:UserSchema}]),
    MongooseModule.forFeature([{name:Product.name, schema:ProductSchema}]),
    MongooseModule.forFeature([{name:Cart_Table.name, schema:Cart_TableSchema}]),
  ],
  controllers: [
    UsersController,
    ProductsController,
    CartTableController,
  ],
  providers: [
    UsersService,
    ProductsService,
    CartTableService,
  ],
})
export class AppModule {}
