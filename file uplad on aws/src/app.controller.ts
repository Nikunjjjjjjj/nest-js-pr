import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import * as AWS from 'aws-sdk';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: './uploads', // Directory to save files
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    })},))
  @Post('file')
  async uploadFile(
    
    @UploadedFile() file: Express.Multer.File,
  ) {
    //console.log(file);
    // const filePath =await path.join(__dirname, '..', 'uploadss', file.originalname)  //file.filename
     console.log(file.path);
    const avatar= await this.appService.awsupload(file.path);
   //console.log(avatar);
   
    return {
      //body,
      //file: file.buffer.toString(),
    };
  }
}
