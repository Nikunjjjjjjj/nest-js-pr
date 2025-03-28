//npm install @nestjs/platform-express multer @azure/storage-blob @nestjs/config
// npm install --save @types/express @types/multer
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AzureBlobService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),],
  controllers: [AppController],
  providers: [AzureBlobService],
})
export class AppModule { }
