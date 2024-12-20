import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config';
import { Excel, ExcelSchema } from './schema/excel.schema';
import { Csv, CsvSchema } from './schema/csv.schema';
//import { RandomDataSchema } from './schema/excel.schema';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO_URI,{
      connectionFactory:(connection) =>{
        connection.on("connected",()=>{
          console.log("mongoose is connected");
          
        });
        connection.on('disconnected', () => {
          console.log('MongooseModule DB disconnected');
        });
        
        connection.on('error', (error: any) => {
          console.log(
            'MongooseModule DB connection failed! for error: ',
            error,
          );
        });
        return connection;  
      },
    }),
    MongooseModule.forRoot('mongodb://localhost/importingdata'
      //useNewUrlParser: true,
     //useUnifiedTopology: true,
    ),
   MongooseModule.forFeature([{name:Excel.name, schema: ExcelSchema}]),
   MongooseModule.forFeature([{name:Csv.name, schema: CsvSchema}])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
