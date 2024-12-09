import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { log } from "console";


@Injectable()
export class AuthService{
    constructor(
        private readonly jwtService:JwtService,
    ){}

    async compareUserpassword(password:any,passwordHash:any):Promise<any>{
        //console.log(passwordHash);
        
        return await bcrypt.compare(password,passwordHash);
    }

    async generateToken(payload : any,secret: string=process.env.SECRET_KEY):Promise<any>{
        //console.log(payload);
        if (secret) {
            return `Bearer ${this.jwtService.sign(payload, { secret })}`;
          } 
        return this.jwtService.sign(payload);
    }

    async decodeAuthToken(authToken: string):Promise<any>{
        const authTokenArray = authToken.split(' ');
        
        
    if (authTokenArray.length > 1) {
      const tokenPayload = this.jwtService.decode(authTokenArray[1]);
      //console.log(authTokenArray[1]);
      return { token: authTokenArray[1], tokenPayload, fullToken: authToken };
    }
        const tokenPayload = this.jwtService.decode(authToken);
    return { token: authToken, tokenPayload, fullToken: authToken };
  }
    

  verifyAuthToken(authToken: string, secret: string = null): any {
    //secret ="key"
    if (secret) {
        return this.jwtService.verify(authToken, { secret });
      }
      return this.jwtService.verify(authToken);
    
}
}