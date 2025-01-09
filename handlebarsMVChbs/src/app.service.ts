import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer-core';
//import { error } from 'console';
//model

@Injectable()
export class AppService {
  constructor (){}
  getHello(): string {
    return 'Hello World!';
  }
 async generateResume(data: any,templatePath: string="views/index.hbs"): Promise<string> {
    // Read the template file
    const template = fs.readFileSync(templatePath, 'utf-8');
    
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);
  
    // Generate the final HTML with dynamic data
    const html = compiledTemplate(data);
 // console.log(html);
  if (!html){
    //throw new error("error in html generation")
    return "error in html generation";
  }
return html;
  // const browser= await puppeteer.launch();
  // const page= await browser.newPage();

  // await page.setContent(html);
  // const pdf=await page.pdf({ format: 'A4' });

  // await browser.close();

  //   res.send(pdf) ;
  }
}





  // async function generateResume(data: any, templatePath: string): Promise<string> {
  //   // Read the template file
  //   const template = fs.readFileSync(templatePath, 'utf-8');
    
  //   // Compile the template
  //   const compiledTemplate = Handlebars.compile(template);
  
  //   // Generate the final HTML with dynamic data
  //   const html = compiledTemplate(data);
  
  //   return html;
  // }
  // const resumeData = {
  //   name: 'John Doe',
  //   jobTitle: 'Software Engineer',
  //   email: 'john.doe@example.com',
  //   phone: '123-456-7890',
  //   summary: 'Experienced software engineer with expertise in backend development.',
  //   education: [
  //     { degree: 'B.Sc. Computer Science', institution: 'ABC University', startYear: 2015, endYear: 2019 },
  //   ],
  //   experience: [
  //     { jobTitle: 'Backend Developer', company: 'XYZ Corp', startYear: 2020, endYear: 2023, description: 'Worked on scalable microservices.' },
  //   ],
  //   skills: 'Node.js, MongoDB, NestJS, TypeScript',
  // };

  // generateResume(resumeData, "./views/index.hbs").then((html) => {
  //   console.log(html); // HTML with data replaced
  // });


