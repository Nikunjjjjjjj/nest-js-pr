import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './services/users.service';
import { FileController } from './controller/file.controller';
import { FileService } from './services/file.service';
import { MongooseModule } from '@nestjs/mongoose';
import  Config  from './config';
import { User, UserSchema } from './schema/user.schema';
import { FileSchema } from './schema/file.schema';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Error, ErrorSchema } from './schema/error.schema';
import { VerifyToken } from './middleware/verify.token.middleware';


@Module({
  imports: [
    MongooseModule.forRoot(Config.MONGO_URI,{
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
    MongooseModule.forRoot('mongodb://localhost/sports-management'),
    MongooseModule.forFeature([{name:User.name, schema:UserSchema}]),
    MongooseModule.forFeature([{name:File.name, schema:FileSchema}]),
    MongooseModule.forFeature([{name:Error.name, schema:ErrorSchema}]),
    JwtModule.register({secret:Config.SECRET_KEY})
  ],
  controllers: [UsersController,FileController],
  providers: [UsersService,FileService,AuthService],
})
export class AppModule {
  constructor(){

  }
  configure(consumer:MiddlewareConsumer){
    consumer
    .apply(VerifyToken)
    .exclude(
      'users/login',
      'users/register'
    )
    .forRoutes('*')
  }
  onModuleInit(){
    console.log("appmodule");
    
  }
}  
// export class AppModule {
//   constructor(){}

//   Configure(consumer:MiddlewareConsumer){
//     consumer
//     .apply(VerifyToken)
//     .exclude(
//       '/users/register',
//       '/users/login'
//     )
//     .forRoutes('*')
//   }
//   onModuleInit(){
//     console.log('AppModule:onModuleInit');
//   }
// }
