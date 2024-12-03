import { MiddlewareConsumer, Module } from '@nestjs/common';

import Config from './configs';
// import CommonUtil from './utils/common.util';
 import { MongooseModule } from '@nestjs/mongoose';
// import { SchemaProvider } from './providers/schema.provider';
// import { AppProvider } from './providers/app.provider';
 import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service'; 

import { User, UserSchema } from './users/schemas/user.schema';
// import { VerifyToken } from './middleware/verifyToken.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(Config.MONGO_URI, {
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
      MongooseModule.forRoot('mongodb://localhost/nestProject'),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],

  controllers: [
    UsersController
  ],
  providers: [
    UsersService,
  ],
})
export class AppModule {
  // constructor(){}
  // configure(consumer: MiddlewareConsumer){
  //   consumer
  //     .apply(VerifyToken)
  //     .exclude(
  //       '/user/register',
  //       '/user/login'
  //     )
  //     .forRoutes('*')
  // }
}
