import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MastersModule } from '../masters/masters.module';
import { CamerasModule } from '../cameras/cameras.module';

@Module({
    imports: [
        MastersModule,
        CamerasModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                };
            },
        }),
    ],
    providers: [JwtStrategy, AuthService],
    exports: [AuthService],
})
export class AuthModule {}
