import {AuthGuard} from '@nestjs/passport';
import {ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {from, Observable, of} from "rxjs";

@Injectable()
export class AtGuard extends AuthGuard('jwt-access') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return of(true);
        }
        const result = super.canActivate(context);
        if (typeof result === 'boolean') {
            return of(result);
        } else if (result instanceof Promise) {
            return from(result);
        } else {
            return result;
        }
    }
}
