import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
@Injectable()
export class AuthService{
    constructor (){}
    compareUserPassword(password: any, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
      }
}