import { MiddlewareConsumer, Module } from '@nestjs/common';
import Config from './configs';
import CommonUtil from './utils/common.util';
import { MongooseModule } from '@nestjs/mongoose';
import { AppProvider } from './providers/app.provider';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { User, UserSchema } from './schema/user.schema';
import { VerifyToken } from './middleware/verifyToken.middleware';
import { AuthService } from './service/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(Config.MONGO_URI, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          CommonUtil.consoleLog('MongooseModule is connected');
        });
        connection.on('disconnected', () => {
          CommonUtil.consoleLog('MongooseModule DB disconnected');
        });
        connection.on('error', (error: any) => {
          CommonUtil.consoleLog(
            'MongooseModule DB connection failed! for error: ',
            error,
          );
        });
        return connection;
      },
    }),
      MongooseModule.forRoot('mongodb://localhost/assignments'),
      // JwtModule.registerAsync({
      //   imports: [ConfigModule], // Import the ConfigModule
      //   useFactory: async (configService: ConfigService) => ({
      //     secret: Config.JWT_SECRET, // Get the secret from the environment variables
      //     signOptions: { expiresIn: '1h' },
      //   }),
      //   inject: [ConfigService],
      // }),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      JwtModule.register({ secret: Config.JWT_SECRET || '441d892774517225be5717fd814cec577f87cd7be9e25bde3f7028fcb5a209547cbc4076f812de1e2b2f6b51c82f6e2dd2c70e9514f8ab353915def8ded4dfa037c080b5bef358a2db164370d7fe3313fb1f0c97aafd800db2949c9d93892b9dd2b2ca11bbb1a579602d30bd42df9689dedafe48c730f485c12f015deb983289921e1fd4e6b696fb3ff7eddc8a3ca68bda55bd5a8deb0557f59b5d419a1f4352d81266df2baf31d3d092554d5709fb00ff57c87052bfc42b9d90a9bbfc10db9a410c1a30e0e893b7f9ed46540241429c5dd1e300289ac52bdc4163c6dfe86d2849aabcbf4570b8007873dc42b88a7d69eaa67be8f151448e1690c00f6213a8b0'}),
    ],

  controllers: [
    UserController
  ],
  providers: [
    UserService,
    AuthService,
    JwtService,
    ...AppProvider
  ],
})
export class AppModule {
  constructor(){
    //console.log('JWT_SECRET from Config:', Config.JWT_SECRET);
  }
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(VerifyToken)
      .exclude(
        '/user/register',
        '/user/login'
      )
      .forRoutes('*')
  }
  onModuleInit(){
    CommonUtil.consoleLog('AppModule:onModuleInit');
  }
}
