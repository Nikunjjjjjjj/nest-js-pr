import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
//import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schema/product.schema';
import { Model } from 'mongoose';


@Injectable() 
export class ProductsService {
  constructor(@InjectModel(Product.name) private productSchema: Model<Product>){}

  async create(createProductDto: CreateProductDto):Promise<any> {
    return await new this.productSchema(createProductDto).save();
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
