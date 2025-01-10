import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ResumeService } from '../services/resume.service';
import { CreateResumeDto } from '../dto/create-resume.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer'; //import * as puppeteer from 'puppeteer';
//npm i -D handlebars@4.5.0 is crutial for html

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination: './uploads', // Directory to save files
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    })
  }))
  @Post()
  async create(@Body() createResumeDto: CreateResumeDto,
  @UploadedFile() file: Express.Multer.File,
) {
  //console.log(file.path);
  const response= await this.resumeService.create(createResumeDto,file.path);
    return response;
  }

  @Get()
  findAll() {
    return this.resumeService.findAll();
  }

  @Get('preview/:id')
  async findOne(@Param('id') id: number,
          @Res() res:Response
) {
    const result= await this.resumeService.findOne(id);
    return res.render('index',result);
  }

  @Get('pdf/:id')
  async pdfGenerator(@Param('id') id: number,
          @Res() res:Response
) {
    //const result= await this.resumeService.findOne(id);
    const browser= await puppeteer.launch();
    const page= await browser.newPage();
    await page.goto(`http://localhost:3000/resume/preview/${id}`);
    const pdf=await page.pdf({ format: 'A4',path:"resume.pdf" });

    await browser.close();
//console.log(pdf);
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
res.sendFile('C:/Users/Admin/Desktop/resume builder/resume-builder/resume.pdf') 
  }

  @Get('screenshot/:id')
  async screenGenerator(@Param('id') id: number,
          @Res() res:Response
) {
  const data= await this.resumeService.findOne(id);
    const html= await this.resumeService.generateHTML(data);
    //console.log(html);
    
    const browser= await puppeteer.launch();
    const page= await browser.newPage();
    await page.setContent(html);
    //await page.setViewport({ width: 1280, height: 720 });
    const example=await page.screenshot({path:"example3.png",fullPage:true });

    await browser.close();

  res.setHeader('Content-Type', 'image/png');
 res.setHeader('Content-Disposition', 'attachment; filename="resume.png"');
    res.sendFile('C:/Users/Admin/Desktop/resume builder/resume-builder/example3.png') ;
 
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
  //   return this.resumeService.update(+id, updateResumeDto);
  // }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(+id);
  }
}
