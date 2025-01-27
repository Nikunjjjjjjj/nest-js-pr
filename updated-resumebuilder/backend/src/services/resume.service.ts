import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from '../dto/create-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from 'src/schema/resume.schema';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { join } from 'path';
import * as Handlebars from 'handlebars';  //npm i -D handlebars@4.5.0
import * as fs from 'fs';

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private readonly resumeSchema:Model<Resume>,
  @InjectModel(User.name) private readonly userSchema:Model<User>
){}

  async create(createResumeDto: CreateResumeDto,localphotoPath) {
    const user= await this.userSchema.findById(createResumeDto.userId);
    if (!user){
      console.error("wrong userid");
      return "wrong userid";
    }
   
    
    return await new this.resumeSchema({...createResumeDto,name:user.name,email:user.email,localPhotoPath:localphotoPath}).save();
  }

  findAll() {
    return `This action returns all resume`;
  }

  async findOne(id: number) {
    const result= await this.resumeSchema.findById(id)
    return result;
  }


  async generateHTML(data: any,templatePath: string="views/index.hbs"): Promise<string> {
    
    //const data= await this.findOne(id);
    //console.log(data);
    
    const template = fs.readFileSync(templatePath, 'utf-8');
    
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);
  
    
    const html = compiledTemplate(data);
 
  if (!html){
    //throw new error("error in html generation")
    return "error in html generation";
  }
return html;}
  // update(id: number, updateResumeDto: UpdateResumeDto) {
  //   return `This action updates a #${id} resume`;
  // }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
