

import { Header,Controller, Get,Body,Put, Post,Param,Query, Delete, ParseIntPipe, UseGuards} from '@nestjs/common';
import { Bookservice } from './book.service';
import { Book } from './data/book.dto';
import { AuthGuard } from './book.guard';



@Controller('book')
export class BookController{

    // public bookService:Bookservice = new Bookservice();
    constructor(private bookService:Bookservice){

    }

    @Post('/add')
    @UseGuards(AuthGuard)
    addBook(@Body() book:Book): string{
        return this.bookService.addBookService(book);
    }

    @Delete('/delete/:id')
    deleteBook(@Param("id") bookId:string): string {
        return this.bookService.deleteBookservice(bookId);
    }

    @Put('/update')
    updateBook(@Body() book:Book): string {
        return this.bookService.updateBookService(book);
    }

    @Get('/findAll')
    getAllBooks(): Book[] {
        return this.bookService.findAllBooks();
    }


    ////////////////pipe
    
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(id,typeof(id));
    
  return "pipe by id";
}

   
}