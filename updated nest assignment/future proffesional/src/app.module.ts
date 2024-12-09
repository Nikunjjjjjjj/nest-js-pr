import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import  Config  from './configs';
import { User, UserSchema } from './schemas/user.schemas';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { VerifyToken } from './middleware/verify.token.middleware';

@Module({
  imports: [MongooseModule.forRoot(Config.MONGO_URI, {
    connectionFactory:(connection)=>{
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
    }
  }),
  MongooseModule.forRoot('mongodb://localhost/nestt'),
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
  JwtModule.register({ secret: Config.SECRET_KEY || 'key'}),
   
],
  controllers: [UsersController],
  providers: [UsersService,
    AuthService,
  ],
})
export class AppModule {
  constructor(){}

  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(VerifyToken)
    .exclude(
      '/users/register',
      '/users/login'
    )
    .forRoutes('*')

  }
}

