import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async awsupload(localfilepath){
    const s3 = new AWS.S3({
      accessKeyId: process.env.access key,
      secretAccessKey: Process.env.secretAccessKey
    });

    const filecontent= fs.readFileSync(localfilepath);

    const params = {
      Bucket: 'bucket0710',
      Key: localfilepath,
      Body: filecontent,
    };

   
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
      }
    });
  }
}
