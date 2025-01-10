import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { ResumeController } from './controller/resume.controller';
import { UsersService } from './services/users.service';
import { ResumeService } from './services/resume.service';
import { MongooseModule } from '@nestjs/mongoose';
import  Config  from './Config';
//import { connection } from 'mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Resume, ResumeSchema } from './schema/resume.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { VerifyToken } from './middleware/verify.token.middleware';


@Module({
  imports: [MongooseModule.forRoot(Config.MONGO_URI,{
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
MongooseModule.forRoot("mongodb://localhost/resume-builder"),
MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
MongooseModule.forFeature([{name: Resume.name,schema:ResumeSchema}]),
JwtModule.register({secret:Config.SECRET_KEY})

],
  controllers: [UsersController,ResumeController],
  providers: [UsersService,ResumeService,AuthService],
})
export class AppModule {
  constructor(){}

  Configure(consumer:MiddlewareConsumer){
    consumer.apply(VerifyToken)
    .exclude(
      '/users/register',
      '/users/login'
    )
    .forRoutes('*')
  }
}
