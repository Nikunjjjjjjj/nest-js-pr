import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
//import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor ( private readonly reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean  {
        const requiredrole= this.reflector.get<Number[]> (
            'roles',
            context.getHandler()
        )
        if(!requiredrole ){
            return true;
        }

        const req:Request | any= context.switchToHttp().getRequest();
        const userRole =req.tokenPayload?.role;
        const roles= Array.isArray(userRole)?userRole: [userRole];

        return requiredrole.some((role)=> roles.includes(role));
    }
}