import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { diskStorage} from 'multer';
import { Express } from 'express';
import * as multer from 'multer';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //future apprroach it can take both file

 @UseInterceptors(FileInterceptor('file',{
  storage: diskStorage({
    destination: './uploads',
    filename:(req,file,cb)=>{
      const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
  })
 }))
 @Post('file')
 async uploadfile(
  @UploadedFile() file: Express.Multer.File,
 ){
  const ext = path.extname(file.originalname).toLowerCase();
  console.log(ext)
  if (ext === '.xlsx') this.uploadExcelfile(file);
  else if ( ext === '.csv') this.uploadCsvfile(file);
  else return "not a csv or excel";
 }


 @UseInterceptors(FileInterceptor('file',{
  storage: diskStorage({                 //multer.diskStorage
    destination: './uploads',
    filename:(req,file,cb)=>{
      const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
  })
 }))
 @Post('Excelfile')
 async uploadExcelfile(
  @UploadedFile() file: Express.Multer.File,
 ){

  //console.log(file.path)
  const result= await this.appService.addDataInExcel(file.path)
  return result;
 }


 @UseInterceptors(FileInterceptor('file',{
  storage: diskStorage({                 
    destination: './uploads',
    filename:(req,file,cb)=>{
      const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
  })
 }))
 @Post('Csvfile')
 async uploadCsvfile(
  @UploadedFile() file: Express.Multer.File,
 ){

  console.log(file.path)
  const result= await this.appService.addDataInCsv(file.path)
  return result;
 }
}
