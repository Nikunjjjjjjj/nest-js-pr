import { Injectable } from '@nestjs/common';
import { UtilService } from './file.utils'; 
import * as fs from 'fs';
import * as path from 'path';
import { FileData, FileDataDocument } from 'src/schema/file.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ErrorSchena } from 'src/schema/error.schema';
import { UpdateFileDto } from 'src/dto/file.dto';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly utilService: UtilService, 
    @InjectModel(FileData.name) private readonly fileDataSchema: Model<FileDataDocument>,
    @InjectModel(ErrorSchena.name) private readonly errorSchema: Model<ErrorSchena>
  ) {}

  async processFile(files: multer.File[]): Promise<any> {
    const uploadId = uuidv4(); 
  
    const fileArray = Array.isArray(files) ? files : [files];
    const results = [];
    const errors = []; 
  
    for (const file of fileArray) {
      console.log('Processing file:', file.originalname);
      const filePath = path.join(__dirname, '../../uploads', file.filename);
      const fileExtension = path.extname(file.originalname).toLowerCase();
  
      let parsedData = [];
      let successRecords = [];
      let errorRecords = [];
  
      try {

        console.log(`Processing file with extension: ${fileExtension}`);        
        if (fileExtension === '.csv') {
          const outputFilePath = filePath.replace('.csv', '.xlsx');
          await this.utilService.convertCSVtoExcel(filePath, outputFilePath);
          parsedData = await this.utilService.processExcel(outputFilePath, uploadId)

        } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
          parsedData = await this.utilService.processExcel(filePath, uploadId);
        } else {
          errors.push({
            file: file.originalname,
            status: 'Failed',
            message: 'Unsupported file type. Please upload a CSV or Excel file.',
          });
          continue; 
        } 
        if (!Array.isArray(parsedData)) {
          throw new Error('Parsed data is not in the expected format.');
        }
        if (parsedData.length === 0) {
          errors.push({
            file: file.originalname,
            status: 'Failed',
            message: 'No records found in the uploaded file.',
          });
          continue; 
        }
  
        for (const item of parsedData) {
          if (Object.values(item).includes('') || Object.values(item).includes(null)) {
            await this.errorSchema.create({
              uploadId: uploadId,          
              fileName: file.originalname,  
              errorMessage: 'Empty cell detected',
              failedRecord: item,
            });
            errorRecords.push(item); 
          } else {
            await this.fileDataSchema.create({
              name: item.name,
              email: item.email,
              phone: item.phone,
              dob: item.dob,
              address: item.address,
              fileId: uploadId, 
            });
            successRecords.push(item); 
          }
        }

        results.push({
          file: file.originalname,
          status: 'Success',
          message: `${successRecords.length} records successfully uploaded.`,
        });
  
        if (errorRecords.length > 0) {
          results.push({
            file: file.originalname,
            status: 'Failed',
            message: `${errorRecords.length} records failed due to empty cells.`,
          });
        }
      } catch (error) {
        console.error('Error processing file:', error.message);
        errors.push({
          file: file.originalname,
          status: 'Failed',
          message: error.message,
        });
      } finally {
        fs.unlinkSync(filePath);
      }
    }  

    console.log('Final results:', results);

    return {
      message: `Successfully processed ${fileArray.length} file(s)!`,
      results: results,
    };
  }

  async getStudentsData(query: any): Promise<any>{
    const { page = 1, limit = 10, name, email, phone, dob, address } = query;

    const filters: any = {};
    if (name) filters.name = { $regex: name, $options: 'i' }; // Case-insensitive 
    if (email) filters.email = email;
    if (phone) filters.phone = phone;   
    if (dob) filters.role = dob;
    if (address) filters.status = address;

    const skip = (page - 1) * limit;
    const studentData = await this.fileDataSchema.find(filters).skip(skip).limit(Number(limit));

    const totalUsers = await this.fileDataSchema.countDocuments(filters);
    return {
      totalUsers,
      page: page,
      limit: limit,
      studentData,
    }; 
    
  }

  async getStuById(id: string): Promise<any>{
     const student = await this.fileDataSchema.findById(id);
     return student;
  }

  async updateStudent(id: string, updateFileDto: UpdateFileDto): Promise<any>{   
    const student = await this.fileDataSchema.findById(id);
    await this.fileDataSchema.updateOne({ _id: id }, { $set: updateFileDto }, {
      new: true,
      runValidators: true,});

    //const updatedStudent = await this.fileDataSchema.findById(id);
    return student;
  }

  async deleteStudent(id: string): Promise<any>{
    const student = await this.fileDataSchema.findById(id);
    if(!student){
      throw new Error(" User with this id does not exist")
    }
    const deleteStu = await this.fileDataSchema.findByIdAndDelete({_id: id},{
      new: true,
      runValidators: true
    })
    return deleteStu;
  }
}
