import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTPayload } from './JWTPayload';
import { Master } from '../masters/master.entity';
import { AuthService } from './auth.service';
import { ROLES } from '../common/constants';
import { Camera } from '../cameras/camera.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(
        request: { role: string },
        payload: JWTPayload,
    ): Promise<Master | Camera> {
        if (request.role === ROLES.MASTER && payload.role === ROLES.MASTER) {
            return this.authService.validateMaster(payload.id as string);
        }

        if (request.role === ROLES.CAMERA && payload.role === ROLES.CAMERA) {
            return this.authService.validateCamera(payload.id as number);
        }

        throw new UnauthorizedException();
    }
}
