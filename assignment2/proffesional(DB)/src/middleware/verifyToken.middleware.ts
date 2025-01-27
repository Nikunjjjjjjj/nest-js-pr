// NPM modules
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/service/user.service';
import { AuthService } from 'src/service/auth.service'; 
import commonUtil from './../utils/common.util';

@Injectable()
export class VerifyToken implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request | any, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).json({
        success: false,
        errors: ['Please enter authorization token'],
      });
    }
    const { token, tokenPayload, fullToken }: any =
      this.authService.decodeAuthToken(authorization);
     // console.log('Decoded Token Payload:', tokenPayload);
    if (!tokenPayload || !tokenPayload.id) {
      return res.status(401).json({
        success: false,
        errors: ['Invalid authorization token'],
      });
    }
    try {
      if (!this.authService.verifyAuthToken(token)) {
        return res.status(401).json({
          success: false,
          errors: ['Authorization token is not valid'],
        });
      }
    } catch (error) {
      commonUtil.consoleLog('VerifyToken:error', error);
      return res.status(401).json({
        success: false,
        errors: ['Authorization token is not valid'],
      });
    }
    const authUserInfo: any = await this.userService.getUserById(
      tokenPayload.UID,
    );
    if (!authUserInfo) {
      return res.status(401).json({
        success: false,
        errors: ['User with this token does not exists'],
      });
    }
    // req.user = {
    //   id: authUserInfo.id,
    //   role: authUserInfo.role, 
    // };
    req.token = token;
    req.tokenPayload = tokenPayload;
    req.fullToken = fullToken;
    req.user = authUserInfo.role;
    next();
  }
}
