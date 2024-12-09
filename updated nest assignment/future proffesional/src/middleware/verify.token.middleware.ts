import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/services/auth.service";
import { UsersService } from "src/services/users.service";

@Injectable()
export class VerifyToken implements NestMiddleware{
    constructor (
        private readonly userService: UsersService,
        private readonly authService: AuthService,
     ){}

     async use (req: Request |any, res: Response, next: NextFunction){
        const {authorization}= req.headers;
        if (!authorization){
            return res.status(400).json({
                success: false,
        errors: ['Please enter authorization token'],
            });
        }
        //console.log(authorization);
        
    const{token, tokenPayload,fullToken}: any= await this.authService.decodeAuthToken(authorization)   ;
    //console.log(tokenPayload);
    
    if (!tokenPayload ){
        return res.status(400).json({
            success: false,
    errors: ['Please enter valid token'],
        });
    } 
    if (!this.authService.verifyAuthToken(token)){
        return res.status(400).json({
            success: false,
    errors: ['verification failed'],
        });
    }
    console.log(tokenPayload);
    
    const authUserInfo: any= await this.userService.findByEmail(tokenPayload.email)
    if (!authUserInfo){
        return res.status(400).json({
        success: false,
errors: ['Please enter authorization token'],
    });
}
    req.token= token
    req.tokenPayload=tokenPayload;
    req.fullToken= fullToken;
    req.user= authUserInfo.role;

    next();
     }
}