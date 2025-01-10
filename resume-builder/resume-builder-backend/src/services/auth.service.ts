import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { error } from "console";
import { Model } from "mongoose";
import { User } from "src/schema/user.schema";
@Injectable()
export class AuthService{
    constructor (@InjectModel(User.name)private readonly userSchema:Model<User>
        ,private readonly jwtservice:JwtService){

    }

    async generateToken(payload:any,secret_key:string=process.env.SECRET_KEY){
        if (secret_key){
            return `Bearer ${this.jwtservice.sign(payload,{secret:secret_key})}`;
        }
        return this.jwtservice.sign(payload);
    }

    async authenticateUserWithToken(authToken:string,userId:any){
        const{token,tokenPayload,fullToken}:any= await this.decodeAuthToken(authToken);
        console.log(tokenPayload.id);
        console.log(userId);
        
        if (tokenPayload.id != userId){
            throw error("invalid userid");
        }
        const user= await this.userSchema.findById(userId);
        const check_status= user.verifyed;
        if (!check_status){
            throw error("not logged in ");
        }
        return "success";
    }
    
    async decodeAuthToken(authToken:string){
        const authTokenArray= authToken.split(' ');
        if (authTokenArray.length > 1 ){
            const tokenPayload = this.jwtservice.decode(authTokenArray[1]);
            //jsonwebtokens.DecodeOptions
            return { token: authTokenArray[1], tokenPayload, fullToken: authToken };
        }
        const tokenPayload = this.jwtservice.decode(authToken);
        
        return { token: authToken, tokenPayload, fullToken: authToken };
    }

    verifyAuthToken(authToken: string, secret: string = null): any {
        //secret ="key"
        //jsonwebtokens.VerifyOption
        if (secret) {
            return this.jwtservice.verify(authToken, { secret });
          }
          return this.jwtservice.verify(authToken);
        
    }
}