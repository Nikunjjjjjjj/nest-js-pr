import { Injectable, Res } from '@nestjs/common';
import { readFileSync } from 'fs';

//import { readFileSync } from 'node:fs';

@Injectable()
export class AppService {
  async streamfile(localfilepath) {
    const file =  readFileSync(localfilepath);
    console.log(file);
    
    return file  ;
  }
}
