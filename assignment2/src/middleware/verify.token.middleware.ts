import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/services/auth.service";
import { UsersService } from "src/services/users.service";

@Injectable()
export class VerifyToken implements NestMiddleware{
    constructor (private readonly userservice:UsersService,
        private readonly authservice:AuthService
    ){}

    async use(req:Request|any, res: Response, next: NextFunction){
        //console.log(req.headers);
        
        const {authorization}= await req.headers;
        //console.log(authorization);
        
        if (!authorization){
            return res.status(404).json({message:"authorization fails"})
        }
        const {token,tokenPayload,fullToken}= await this.authservice.decodeAuthToken(authorization);
        if (!tokenPayload){
            return res.status(404).json({message:"no token payload"});
        }
        if(!this.authservice.verifyAuthToken(token)){
            return res.status(404).json({message:"verification failed"})
        }
        const authUserInfo= await this.userservice.findbyEmail(tokenPayload.email);
       // console.log(authUserInfo);
        
        if (!authUserInfo){
            return res.status(400).json({
                success:"false",
                message:"authUserInfo failed"
            })
        }
        //console.log(authUserInfo);
        //console.log(authUserInfo.role);
        req.token=token;
        req.tokenPayload=tokenPayload;
        req.fullToken= fullToken;
        req.user = authUserInfo.role;
        next();
    }
}