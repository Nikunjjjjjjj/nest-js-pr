//npm install @nestjs/platform-express multer @azure/storage-blob @nestjs/config
// npm install --save @types/express @types/multer
import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AzureBlobService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
@Controller()
export class AppController {
  constructor(private readonly azureBlobService: AzureBlobService) { }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    const uploadResponse = await this.azureBlobService.uploadFile(file);
    console.log(uploadResponse);

    return {
      message: 'File uploaded successfully',
      blobUrl: uploadResponse.requestId,  // You can get the blob URL if needed
    };
  }
}
