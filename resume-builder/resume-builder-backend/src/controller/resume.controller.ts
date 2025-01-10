import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { ResumeService } from '../services/resume.service';
import { CreateResumeDto } from '../dto/create-resume.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer'; //import * as puppeteer from 'puppeteer';
import { AuthService } from 'src/services/auth.service';
import { error } from 'console';
//npm i -D handlebars@4.5.0 is crutial for html

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService,
    private readonly authService:AuthService
  ) {}

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
  @Req() req:Request
) {
  
  
  const user_check= await this.authService.authenticateUserWithToken(req.headers.authorization,createResumeDto.userId);
  const response= await this.resumeService.create(createResumeDto,file.path);
    return response;
  }

  @Get()
  findAll() {
    return this.resumeService.findAll();
  }

  @Get('preview/:id')
  async findOne(@Param('id') id: number,
          @Res() res:Response,
          @Req() req:Request
) {

  try {
    const result= await this.resumeService.findOne(id);

    const user_check= await this.authService.authenticateUserWithToken(req.headers.authorization,result.userId);
    return res.render('index',result);
  } catch (error) {
    res.status(401).json(` preveiw unavailable due to ${error}`)
  }
   
  }

  @Get('pdf/:id')
  async pdfGenerator(@Param('id') id: number,
          @Res() res:Response,
          @Req() req:Request
) {
 try {
  const browser= await puppeteer.launch();
    const page= await browser.newPage();

    await page.setRequestInterception(true);

      // Intercept requests and modify headers or data
      page.on('request', (interceptedRequest) => {
        interceptedRequest.continue({
          headers: {
            //...interceptedRequest.headers(),
            
            Authorization: req.headers['authorization'] || '', 
          },
        });
      });
    
    (await page.goto(`http://localhost:3000/resume/preview/${id}`));
    const pdf=await page.pdf({ format: 'A4',path:"resume.pdf" });

    await browser.close();
//console.log(pdf);
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
res.sendFile('C:/Users/Admin/Desktop/resume builder/resume-builder/resume.pdf') ;
 } catch (error) {
  res.status(401).json(`problem in pdf generation ${error.message}`);
 }
    
  }

  @Get('screenshot/:id')
  async screenGenerator(@Param('id') id: number,
          @Res() res:Response,
          @Req() req:Request
) {
  try {
    const data= await this.resumeService.findOne(id);
    const user_check= await this.authService.authenticateUserWithToken(req.headers.authorization,data.userId);
      const html= await this.resumeService.generateHTML(data);
     
      
      const browser= await puppeteer.launch();
      const page= await browser.newPage();
      await page.setContent(html);
      //await page.setViewport({ width: 1280, height: 720 });
      const example=await page.screenshot({path:"example3.png",fullPage:true });
  
      await browser.close();
  
    res.setHeader('Content-Type', 'image/png');
   res.setHeader('Content-Disposition', 'attachment; filename="resume.png"');
      res.sendFile('C:/Users/Admin/Desktop/resume builder/resume-builder/example3.png') ;
  } catch (error) {
    res.status(401).json(`problem in screenshot generation ${error.message}`);
  }
 
 
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
