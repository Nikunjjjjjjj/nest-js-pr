import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as nodemailer from 'nodemailer'; //npm i --save-dev @types/nodemailer
@Controller('email')
export class AppController {
  private transporter;
  constructor(private readonly appService: AppService, ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'njwarrior0710@gmail.com',
        pass: Config.passKey,
      },
    });
  }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Post()
  async sendemail(){
    const password="password";
    const loginLink="loginlink";
    const toMail='nikunjjain0710@gmail.com';
    let mailOptions = {
      from: 'njwarrior0710@gmail.com',
      to: `${toMail}`,
      subject: 'Sending Email using Node.js',
      text: `That was easy ${password} and login : ${loginLink}`
    };
    this.transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
