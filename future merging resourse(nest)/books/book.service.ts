import { Injectable } from "@nestjs/common";
import { Book } from "./data/book.dto";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Bookservice{
    public books:Book[]=[];
    
    addBookService(book:Book): string{
        //id auto generate
        book.id=uuidv4();
        this.books.push(book);
        return "this will add book";
    }

    
    deleteBookservice(bookId:string): string {
        this.books = this.books.filter((book) =>{
            return book.id != bookId;
        })
        return " this will remove book"
    }

   
    updateBookService(book:Book): string {
        let index= this.books.findIndex((currentuser)=>{
            return currentuser.id == book.id;
        })
        this.books[index]=book;
        return "this will update book"
    }


    findAllBooks(): Book[] {
        return this.books;
    }

}