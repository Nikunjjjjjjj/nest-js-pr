import { Injectable } from '@nestjs/common';
import { CreateFileDto } from '../dto/create-file.dto';
import { AuthService } from './auth.service';
import * as xlsx from 'xlsx';
import { InjectModel } from '@nestjs/mongoose';
import { File } from 'src/schema/file.schema';
import { Model } from 'mongoose';
import { Error } from 'src/schema/error.schema';
import * as csvparser from 'csv-parser';
import * as fs from 'node-fs';  //npm i --save-dev @types/node-fs
@Injectable()
export class FileService {
  constructor (private readonly authservice:AuthService,
    @InjectModel(File.name) private readonly fileschema:Model<File>,
    @InjectModel(Error.name) private readonly errorschema:Model<File>
  ){}
  async addDatafromExcel(createFileDto: CreateFileDto,localFilepath,uploadedby) {
    const workbook= xlsx.readFile(localFilepath);
    const sheetName= workbook.SheetNames[0]
    let jsonData= xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); //we didnt get empty spaces
    //console.log(jsonData);
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }) as any[][];
    const headers = rawData[0];
    let dataIn=[]
    let dataOut=[]
    const validData = rawData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null));
    const formattedData = validData.map((row) => {
      const rowObj = {};
      headers.forEach((header, index) => {
        rowObj[header.trim()] = row[index] || 'null';
      });
      return rowObj;
    });
    console.log(formattedData);//we are putting null
    
    formattedData.forEach((row) => {
      
      if (Object.values(row).some(value => value === undefined || value === 'null' || value === '')) {
        dataOut.push(row); // Add to missingData if there's any missing value
      } else {
        dataIn.push(row); // Otherwise, add to mainData
      }
    });
    console.log(dataIn);
    console.log(dataOut);
    const dataInMongo= await this.fileschema.create({...createFileDto,uploadedBy:uploadedby,healthStatics:dataIn})
    const errorInMongo= await this.errorschema.create({...createFileDto,uploadedBy:uploadedby,errorInData:dataOut})
    fs.unlink(localFilepath, () => {
      console.error('deleting file:');
   });
    return 'success';
  }

  async addDataFromCSV(createFileDto: CreateFileDto,localFilepath,uploadedby){
    const dataIn=[]
    const dataOut=[]
    const result= await fs.createReadStream(localFilepath)
    .pipe(csvparser())
    .on("data",async (row)=>{
      //console.log(row);
      if (Object.values(row).some(value => value === undefined || value === null || value === '')) {
        dataOut.push(row); // Add to missingData if there's any missing value
      } else {
        dataIn.push(row); // Otherwise, add to mainData
      }
    })
    .on("end",async () => {
    //  console.log(dataIn);
    //  console.log(dataOut);
     const dataInMongo= await this.fileschema.create({...createFileDto,uploadedBy:uploadedby,healthStatics:dataIn})
    const errorInMongo= await this.errorschema.create({...createFileDto,uploadedBy:uploadedby,errorInData:dataOut});
    })
    .on("end",async () => {
      fs.unlink(localFilepath, () => {
        console.log('deleting file:');
      });
    })
    return 'success';
  }

  async UplodedBy(tokenreceived:any){
    const{token,tokenPayload,fullToken}:any= await this.authservice.decodeAuthToken(tokenreceived);
    return tokenPayload.id;
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
