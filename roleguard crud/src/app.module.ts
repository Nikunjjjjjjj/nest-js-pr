import { MiddlewareConsumer, Module } from '@nestjs/common';

import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import Config from './Config';
import { User, UserSchema } from './schema/user.schema';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { VerifyToken } from './middleware/verifytoken.middleware';

@Module({
  imports:[ MongooseModule.forRoot(Config.MONGO_URI, {
    connectionFactory: (connection) => {
      connection.on('connected', () => {
        console.log('MongooseModule is connected');
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
  
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({secret:Config.SECRET_KEY})],
  controllers: [UsersController],
  providers: [UsersService,AuthService],
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
