import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/services/auth.service";
import { UsersService } from "src/services/users.service";

@Injectable()
export class VerifyToken implements NestMiddleware{
    constructor(private readonly authService:AuthService,
        private readonly userService:UsersService
    ){}

    async use(req: Request| any, res: Response, next: NextFunction) {
        const {authorization}= req.header;
        if (!authorization){
            return res.status(404).json({message:"authorization fails"})
        }
        const{token,tokenPayload,fullToken}:any= await this.authService.decodeAuthToken(authorization);

        if (!tokenPayload){
            return res.status(400).json({
                success:"false",
                message:"not a valid token"
            })
        }

        if (this.authService.verifyAuthToken(token)){
            return res.status(400).json({
                success:"false",
                message:"Validation failed"
            })
        }

        const authUserInfo = this.userService.findbyEmail(tokenPayload.email);

        if (!authUserInfo){
            return res.status(400).json({
                success:"false",
                message:"authUserInfo failed"
            })
        }
        req.token=token;
        req.tokenPayload=tokenPayload;
        req.fullToken=fullToken;

        next();
    }
}