import { CanActivate, ExecutionContext, Request } from "@nestjs/common";
//import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { Observable } from "rxjs";

export class RoleGuard implements CanActivate{
    private rolePassed:boolean;
    constructor (role:boolean){
        this.rolePassed = role
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        //console.log(context);
        
        const ctx= context.switchToHttp()
        //console.log(ctx);
        
        const request:any=ctx.getRequest<Request>();
        //console.log(request.user);
        
        return this.rolePassed == request.user.role;
    }
}