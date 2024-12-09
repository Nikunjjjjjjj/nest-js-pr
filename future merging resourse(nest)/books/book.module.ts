import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { Bookservice } from "./book.service";
import { BookController } from "./book.controller";
import { BookMiddleware } from "./book.middleware";

@Module({
    imports:[],
    controllers :[BookController],
    providers :[Bookservice]
})
export class BookModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BookMiddleware).forRoutes('book');
    }
}