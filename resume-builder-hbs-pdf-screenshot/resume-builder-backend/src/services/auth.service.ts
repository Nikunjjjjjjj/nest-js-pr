import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService{
    constructor (private readonly jwtservice:JwtService){

    }
    async generateToken(payload:any,secret_key:string=process.env.SECRET_KEY){
        if (secret_key){
            return `Bearer ${this.jwtservice.sign(payload,{secret:secret_key})}`;
        }
        return this.jwtservice.sign(payload);
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