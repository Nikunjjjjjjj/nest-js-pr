import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
//import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private readonly reflector:Reflector){}
    canActivate(context: ExecutionContext): any  {
        const required_role=this.reflector.get<number[]>(
            'roles',
            context.getHandler(),
        );

        if (!required_role){
            return true;
        }
        const req: Request | any = context.switchToHttp().getRequest();
    const userRoles = req.tokenPayload?.role;

    const roles = Array.isArray(userRoles) ? userRoles : [userRoles];

    return required_role.some((role) => roles.includes(role));
    }
}