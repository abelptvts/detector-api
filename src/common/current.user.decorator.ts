import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Camera } from '../cameras/camera.entity';
import { Master } from '../masters/master.entity';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Promise<Master | Camera> => {
        const httpRequest = ctx.switchToHttp().getRequest();
        return httpRequest.user;
    },
);
