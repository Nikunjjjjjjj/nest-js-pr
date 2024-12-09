import { CanActivate, ExecutionContext, Request } from "@nestjs/common";
//import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { Observable } from "rxjs";

export class RoleGuard implements CanActivate{
    private rolePassed:string;
    constructor (role:string){
        this.rolePassed = role
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx= context.switchToHttp()
        const request:any=ctx.getRequest<Request>();
        return this.rolePassed == request.user.role;
    }
}