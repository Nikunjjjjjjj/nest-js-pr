import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Path from 'path';

// Configs
import Config from './configs';

// Utils
import CommonUtil from './utils/common.util';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');

    global.rootPath = __dirname;
    global.storagePath = Path.join(__dirname, 'storage');

    app.listen(Config.APP_PORT, () => {
      CommonUtil.consoleLog('App is listening on port:', Config.APP_PORT);
    });
  } catch (e) {
    CommonUtil.consoleLog('bootstrap:error:', e);
    CommonUtil.consoleLog('Exiting the app due to bootstrap error');
    process.exit(1);
  }
}
bootstrap();
