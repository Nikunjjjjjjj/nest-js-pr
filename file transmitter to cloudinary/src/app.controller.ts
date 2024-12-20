import {
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AppService } from './app.service';
//import { SampleDto } from './sample.dto';
import * as path from "path";
import { SampleDto } from './sample.dto';
import { diskStorage } from 'multer';
import fs from "fs";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sayHello() {
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
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    // const filePath =await path.join(__dirname, '..', 'uploadss', file.originalname)  //file.filename
     console.log(file.path);
    const avatar= await this.appService.uploadOnCloudinary(file.path);
   console.log(avatar.url);
   
    return {
      body,
      //file: file.buffer.toString(),
    };
  }

  // @UseInterceptors(FileInterceptor('file'))
  // @Post('file/pass-validation')
  // uploadFileAndPassValidation(
  //   @Body() body: SampleDto,
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'json',
  //       })
  //       .build({
  //         fileIsRequired: false,
  //       }),
  //   )
  //   file?: Express.Multer.File,
  // ) {
  //   return {
  //     body,
  //     file: file?.buffer.toString(),
  //   };
  // }

  // @UseInterceptors(FileInterceptor('file'))
  // @Post('file/fail-validation')
  // uploadFileAndFailValidation(
  //   @Body() body: SampleDto,
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'jpg',
  //       })
  //       .build(),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return {
  //     body,
  //     file: file.buffer.toString(),
  //   };
  // }
}