import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { FileService } from '../services/file.service';
import { CreateFileDto } from '../dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Request } from 'express';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/decorator/role.decorator';


@Controller('file')
@UseGuards(RoleGuard)
@Roles('coach')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: './uploads',
      filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
      },
    })
   }))
  @Post()
  @Roles('coach')
  async uploadFile(@Body() createFileDto: CreateFileDto,
   @UploadedFile() file:Express.Multer.File,
   @Req() req:Request
) {
  const ext= path.extname(file.originalname).toLowerCase();
  //console.log(ext);
  const uploadedBy=await this.fileService.UplodedBy(req.headers.authorization);
  //console.log(uploadedBy);
  if (ext === '.xlsx') {
    return this.fileService.addDatafromExcel(createFileDto,file.path,uploadedBy);
  } else if (ext === '.csv'){
    return this.fileService.addDataFromCSV(createFileDto,file.path,uploadedBy);
  }else{
    return "not a csv or excel";
  }
    
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.fileService.update(+id, updateFileDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
