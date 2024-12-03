import { PassportStrategy } from "@nestjs/passport";
import { Strategy ,ExtractJwt} from "passport-jwt";

import { Injectable } from "@nestjs/common";
//import { Strategy } from "passport-strategy";


@Injectable()
export class JwtStratergy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "key",
          });
    }
    validate(payload:any):any{
        return payload;
    }
}