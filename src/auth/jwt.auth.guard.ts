import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const httpRequest = context.switchToHttp().getRequest();
        httpRequest.role = this.reflector.get<string>(
            'role',
            context.getHandler(),
        );
        return super.canActivate(context);
    }
}
