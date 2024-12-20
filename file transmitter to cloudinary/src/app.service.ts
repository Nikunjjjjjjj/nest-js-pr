import { Injectable } from '@nestjs/common';
import {v2 as cloudinary} from "cloudinary"
import { log } from 'console';
import * as fs from 'node-fs';
import * as path from "path";


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

   async uploadOnCloudinary (localFilePath) {
    cloudinary.config({ 
      cloud_name: process.env.cloud_name, 
      api_key: process.env.api_key, 
      api_secret: process.env.api_secret, 
    });
    try {
        //if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded abh unlink
        console.log( response.url);
        //const deletefilepath = path.join('C:', 'Users', 'Admin', 'Desktop', 'upload file', 'upload-file', localFilePath);
         //console.log(deletefilepath)
        // fs.unlinkSync(deletefilepath);
        fs.unlink(localFilePath, () => {
           console.error('deleting file:');
        });

        //fs.unlinkSync
        return response;

    } catch (error) {
        //fs.unlinkSync(localFilePath) // remove the locally saved temporary file 
        return null;
    }
}

}
