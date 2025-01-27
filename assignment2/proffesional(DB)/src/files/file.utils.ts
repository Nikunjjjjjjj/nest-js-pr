import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as xlsx from 'xlsx';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileData, FileDataDocument } from 'src/schema/file.schema';
import { ErrorDocument, ErrorSchena } from 'src/schema/error.schema';
import * as XLSX from 'xlsx';

export class UtilService {
    constructor( @InjectModel(FileData.name)private readonly fileData: Model<FileDataDocument>,
    @InjectModel(ErrorSchena.name) private errorSchema: Model<ErrorDocument>
  ){}

  async processExcel(filePath: string, fileId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const file = fs.readFileSync(filePath);
      const workbook = xlsx.read(file, { type: 'buffer' });

      const sheetName = workbook.SheetNames[0];
      const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }) as any[][]; 

      if (!rawData[0] || rawData[0].some(cell => typeof cell !== 'string' || cell.trim() === '')) {
        return reject(new Error('Excel file must contain valid headers'));
      }

      const headers = rawData[0];
      const validData = rawData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null));

      const formattedData = validData.map((row) => {
        const rowObj = {};
        headers.forEach((header, index) => {
          rowObj[header.trim()] = row[index] || null;
        });
        return rowObj;
      });

      resolve(formattedData);
    });
  }
      
  async convertCSVtoExcel(csvFilePath: string, outputPath: string): Promise<void> {
    try {
      const csvData = fs.readFileSync(csvFilePath, 'utf-8');
          
      const worksheet = XLSX.utils.aoa_to_sheet(this.csvToArray(csvData));
          
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          
      XLSX.writeFile(workbook, outputPath);
          
      console.log(`File successfully converted to Excel and saved at ${outputPath}`);
      } catch (error) {
        console.error('Error converting CSV to Excel:', error.message);
        throw new Error('Failed to convert CSV to Excel.');
      }
  }
    
  private csvToArray(csv: string): any[][] {
    const lines = csv.split('\n');
    return lines.map(line => line.split(','));
  }
     
}
