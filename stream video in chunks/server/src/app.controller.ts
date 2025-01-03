import { Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import { createReadStream, statSync } from 'node-fs';


//const _fileName= fileURLToPath(import.meta.url)

@Controller('file')
export class AppController {
  constructor(private readonly appService: AppService) {}

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
   async uploadfile(
    @UploadedFile() file: Express.Multer.File,
    
   ){
  
    console.log(file.path)
    //const result= await this.appService.streamfile(file.path);
    //res.sendFile(file.path)
    return "sucess";
   }
   

//    @Get()
//    async showfile(
//     @Req() req: Request,
//     @Res() res: Response
//    ){
//     //by name/id ?
//     const filepath= "C:/Users/Admin/Desktop/stream video/server/uploads/1735818502062-SampleVideo_1280x720_10mb.mp4";
//     const range=req.headers.range;
//     console.log(range);
//     if (!range) {
//       // If no range header is present, you can send the entire file or handle it differently
//       return res.status(416).send('Range header is required for partial content.');
//     }
    
//     const stat= statSync(filepath)
//     const fileSize= stat.size;
//     const chunkSize=10**6;
//     const start= Number(range.replace(/\D/g,""));
//     const end= Math.min(start+chunkSize,fileSize);
//     const contentLength= start+end-1;


    
//     const fileStream= createReadStream(filepath,{
//       start,
//       end
//     })
//     fileStream.pipe(res)
//     //res.sendFile(filepath)
//     const header={
//       "Content-Range":`bytes ${start}-${end}/${fileSize}`,
//       "Accept-Ranges":`bytes`,
//       "Content-Length": contentLength,
//       "Content-Type":"video/mp4"
//     }
//     res.writeHead(206,header)
    
// //to prevent video from download
//    }
//create dto
@Get()
async showfile(
  @Req() req: Request,
  @Res() res: Response
) {
  const filepath = "C:/Users/Admin/Desktop/stream video/server/uploads/1735818502062-SampleVideo_1280x720_10mb.mp4";
  const range = req.headers.range;

  if (!range) {
    // If no range header is provided, send the entire file
    return res.sendFile(filepath, {
      headers: {
        'Content-Disposition': 'inline', // Ensure it's viewed, not downloaded
        'Content-Type': 'video/mp4', // Assuming the file is a video
      }
    });
  }

  console.log(range);

  const stat = statSync(filepath);
  const fileSize = stat.size;

  // Parse the range (e.g., "bytes=0-999999")
  const rangeParts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(rangeParts[0], 10);
  const end = rangeParts[1] ? parseInt(rangeParts[1], 10) : start + (10 ** 6) - 1; // Default to 1MB chunks

  // Ensure the requested range does not exceed the file size
  const chunkStart = Math.min(start, fileSize - 1);
  const chunkEnd = Math.min(end, fileSize - 1);
  const contentLength = chunkEnd - chunkStart + 1;

  // If the requested range is invalid (out of bounds), return a 416 status
  if (chunkStart > chunkEnd) {
    return res.status(416).send({
      message: `Requested range ${start}-${end} is out of bounds.`
    });
  }

  const fileStream = createReadStream(filepath, {
    start: chunkStart,
    end: chunkEnd
  });
  fileStream.pipe(res);
  // Set the headers for partial content
  res.setHeader('Content-Range', `bytes ${chunkStart}-${chunkEnd}/${fileSize}`);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Length', contentLength);
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'no-store'); // Prevent caching
  res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent content sniffing

  // Send the file stream with a 206 Partial Content status
  res.status(206);
 // fileStream.pipe(res);
}

}
