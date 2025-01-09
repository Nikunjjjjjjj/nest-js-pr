import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as open from 'open';
//import * as puppeteer from 'puppeteer-core'; //puppeteer is not downloading
//import {default} from 'open';
//import * as pdf from 'html-pdf';
import puppeteer from 'puppeteer';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {

  }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  


  // @Get() // we get html page ,now to get html code?????
  // @Render('index')
  // root() { 
  //   return {
  //     name: 'John Doe',
  //     jobTitle: 'Software Engineer',
  //     email: 'john.doe@example.com',
  //     phone: '123-456-7890',
  //     summary: 'Experienced software engineer with expertise in backend development.',
  //     education: [
  //       { degree: 'B.Sc. Computer Science', institution: 'ABC University', startYear: 2015, endYear: 2019 },
  //     ],
  //     experience: [
  //       { jobTitle: 'Backend Developer', company: 'XYZ Corp', startYear: 2020, endYear: 2023, description: 'Worked on scalable microservices.' },
  //     ],
  //     skills: 'Node.js, MongoDB, NestJS, TypeScript',
  //   };
  // }
 

  @Get('preview') // we get html page ,now to get updated html code?????
  root(@Res() res:Response){
    const data= {
      name: 'NJJ',
      jobTitle: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      summary: 'Experienced software engineer with expertise in backend development.',
      education: [
        { degree: 'B.Sc. Computer Science', institution: 'ABC University', startYear: 2015, endYear: 2019 },
      ],
      experience: [
        { jobTitle: 'Backend Developer', company: 'XYZ Corp', startYear: 2020, endYear: 2023, description: 'Worked on scalable microservices.' },
      ],
      skills: 'Node.js, MongoDB, NestJS, TypeScript',
    };
    return res.render("index",data)
  }

  @Get('resume')
  async generateResume(@Res() res:Response){
    const data= {
      name: 'NJR',
      jobTitle: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      summary: 'Experienced software engineer with expertise in backend development.',
      education: [
        { degree: 'B.Sc. Computer Science', institution: 'ABC University', startYear: 2015, endYear: 2019 },
      ],
      experience: [
        { jobTitle: 'Backend Developer', company: 'XYZ Corp', startYear: 2020, endYear: 2023, description: 'Worked on scalable microservices.' },
      ],
      skills: 'Node.js, MongoDB, NestJS, TypeScript',
    };
    const html= await this.appService.generateResume(data);
   //console.log(html);
    const browser= await puppeteer.launch(); //{executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',  // Change this to the actual path of Chrome on your system}





  const page= await browser.newPage();

  //await page.goto("http://localhost:3000/preview");
  //const example=await page.screenshot({ path:"example3.png" });
  //console.log(example);
  
  await page.setContent(html);//not working reeeeeeeeeeeeeeeeeeeeeeeeeeeeeetry
   const pdf=await page.pdf({ format: 'A4',path:"resume.pdf" });//path:"C:/Users/Admin/Desktop/mvc handlebar example/project/upload",
 
  //await open.default('C:/Users/Admin/Desktop/mvc handlebar example/project/upload')
  //const screenshot = await page.screenshot({ fullPage: true });
  
 await browser.close();
//console.log(pdf);
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
res.sendFile('C:/Users/Admin/Desktop/mvc handlebar example/project/resume.pdf') ;

     // Send the screenshot as an image file ////working
  // res.setHeader('Content-Type', 'image/png');
  // res.setHeader('Content-Disposition', 'attachment; filename="resume.png"');
  //   res.sendFile('C:/Users/Admin/Desktop/mvc handlebar example/project/example3.png') ;
   // res.sendFile('./example.png')
    //return "success";
  }

}
