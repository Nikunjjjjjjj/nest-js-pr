import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file.service';
import { diskStorage } from 'multer';
import * as multer from 'multer'
import { Roles } from 'src/decorator/role.decorator';
import { RolesGuard } from 'src/guard/role.guard';
import commonUtil from 'src/utils/common.util';
import { Response } from 'express';
import { UpdateFileDto } from 'src/dto/file.dto';
import validatorsUtil from 'src/utils/validators.util';
import { AppError } from 'src/utils/appError';
import * as fs from 'fs';
import * as path from 'path';  

@Controller('import-file')
@UseGuards(RolesGuard)
@Roles("ADMIN")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async importFile(@UploadedFiles() files: multer.File[]) {
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded'); 
      }
  
      const allResults = [];
  
      for (const file of files) {
        try {
          const result = await this.fileUploadService.processFile(file);
          allResults.push(result);
        } catch (error) {
          allResults.push({
            file: file.originalname,
            status: 'Failed',
            message: error.message,
          });
        }
      }  
      return {
        status: 200,
        message: `Successfully processed ${files.length} file(s)!`,
        results: allResults,
      };
    } catch (error) {
      return {
        status: 500,
        message: `An unexpected error occurred: ${error.message}`,
      };
    }finally {
      for (const file of files) {
        const filePath = path.join('./uploads', file.filename); 
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
          else console.log(`Deleted file: ${filePath}`);
        });
      }
}
  }

  @Get()
  async getAllStudents(
    @Query() query: any,
    @Res() res: Response
  ): Promise<any> {
    try {
      commonUtil.consoleLog('FileController:getAllStudents:start');
      const students = await this.fileUploadService.getStudentsData(query);
      commonUtil.consoleLog('FileController:getAllStudents:end', { students });
      return res.status(200).json(students);
    } catch (e) {
      commonUtil.consoleLog('FileController:createUser:error', e);
      if (e instanceof AppError) {
        return res.status(e.getStatusCode()).json(e);
      } else {
        return res
          .status(500)
          .json(new AppError(500).addServerError('Unable to fetch user'));
      }
    }
  }
  

  @Put(':id')
  async updateStudent(
   @Param('id') id: string,
   @Body() updateFileDto: UpdateFileDto,
   @Res() res: Response,
   @Req() req: Request
  ): Promise<any> {
   try {
    commonUtil.consoleLog('FileController:updateStudent:start');
    const { params }: any = req;
    const students = await this.fileUploadService.getStuById(params.id);
      if(!students){
        return res.status(404).json({ message: 'Student not found' });
    }
    const updatedStudent = await this.fileUploadService.updateStudent(params.id, params.updateFileDto);
    commonUtil.consoleLog('FileController:updateStudent:end', { updatedStudent });
    return res.status(200).json(updatedStudent);
  }catch (e) {
    commonUtil.consoleLog('FileController:createUser:error', e);
    if (e instanceof AppError) {
      return res.status(e.getStatusCode()).json(e);
    } else {
      return res
        .status(500)
        .json(new AppError(500).addServerError('Unable to update user'));
    }
  }
}


  @Delete(':id')
  async deleteStudent(
    @Param('id') id : string,
    @Res() res: Response,
    @Req() req: Request
  ): Promise<any>{
    try{
      commonUtil.consoleLog('FileController:deleteStudent:start');
      const { params }: any = req;
      const students = await this.fileUploadService.getStuById(params.id);
      if(!students){
        return res.status(404).json({ message: 'Student not found' });
    }
      const student = await this. fileUploadService.deleteStudent(params.id);
      commonUtil.consoleLog('FileController:deleteStudent:end');
      return res.status(200).json({ message: 'Student deleted successfully', student });
    }catch (e) {
      commonUtil.consoleLog('FileController:createUser:error', e);
      if (e instanceof AppError) {
        return res.status(e.getStatusCode()).json(e);
      } else {
        return res
          .status(500)
          .json(new AppError(500).addServerError('Unable to delete user'));
      }
    }
  }
}
