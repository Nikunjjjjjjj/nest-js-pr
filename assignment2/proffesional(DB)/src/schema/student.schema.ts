import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsOptional } from 'class-validator';
import { HydratedDocument } from "mongoose";

export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student extends Document {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  studentName: string;

  @Prop({ required: true })
  @IsNotEmpty()
  dateOfBirth: string;

  @Prop({ required: true })
  @IsNotEmpty()
  grade: string; 

  @Prop({ required: true })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string; 

  @Prop({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string; 

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  address: string; 

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  guardianName: string; 

  @Prop({ required: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  emergencyContact: string; 

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  institutionName: string; 

  @Prop()
  @IsOptional()
  studentPhoto: string; 

  @Prop({ required: true, default: [] })
  @IsOptional()
  achievements: string[]; 

  @Prop({ required: true })
  @IsNotEmpty()
  identityDocument: string; 
}

export const StudentSchema = SchemaFactory.createForClass(Student);
