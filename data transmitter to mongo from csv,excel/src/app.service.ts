import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as xlsx from 'xlsx';
import { Excel } from './schema/excel.schema';
import * as fs from 'node-fs';
import { Csv } from './schema/csv.schema';
import * as csvparser from "csv-parser";

@Injectable()
export class AppService {
  constructor(@InjectModel(Excel.name) private readonly excel: Model<Excel>,
         @InjectModel(Csv.name) private readonly csv: Model<Csv>,     
      ) {}

  async addDataInExcel(filePath: any): Promise<any> {
    const workbook= xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    //console.log(sheetName);
    let jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
      //console.log({...jsonData});///loop for individual ,this.excel.insertMany(jsonData);
      //const result=  jsonData.map(async(jsondata)=> await new this.excel(jsondata));
      //let result= await new this.excel({...jsonData})
      const randomDataArray = [];
      let rand=JSON.stringify({...jsonData});
      console.log(rand);
      
      // for (let i=0;i<jsonData.length;i++){
      //   //console.log(jsonData[i]);
      //   randomDataArray.push({i:jsonData[i]})
      //   //result= await new this.excel(jsonData[i])
      // }
      //console.log(randomDataArray);
      
      //const result = await this.excel.create({data:rand});
      const result = await this.excel.create([{data:{...jsonData}}]);
      //const result = await new this.excel([{data:{...jsonData}}]); chal raha hai but postman pe kyun galat

      fs.unlink(filePath, () => {
        console.error('deleting file:');
     });
    return result;
  }




  async addDataInCsv(filepath: any): Promise<any> {
    const datain=[]
     const result=await fs.createReadStream(filepath)
    .pipe(csvparser())
    .on("data",async (row) => {
    //console.log(row);
    //const datain=[];
    datain.push(row)
    //console.log(datain)
    return datain;
    //return await  this.csv.create([{data:datain}]);
  })
  .on("end",async () => {
    // When the file processing is done,
    //console.log(datain); 
    return await  this.csv.create([{data:datain}]);
  })
  .on("end",async () => {
    fs.unlink(filepath, () => {
      console.error('deleting file:');
    });
  })
 // console.log(datain);
 return "success";
    
  }
 
}
