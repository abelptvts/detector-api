import { Module } from '@nestjs/common';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camera } from './camera.entity';
import { Master } from '../masters/master.entity';
import { Detection } from '../detections/detection.entity';
import { CamerasGateway } from './cameras.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Camera, Master, Detection]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                };
            },
        }),
    ],
    controllers: [CamerasController],
    providers: [CamerasService, CamerasGateway],
    exports: [CamerasService],
})
export class CamerasModule {}
