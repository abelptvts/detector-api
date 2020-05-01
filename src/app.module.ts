import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DetectionsModule } from './detections/detections.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MastersModule } from './masters/masters.module';
import { CamerasModule } from './cameras/cameras.module';
import { Master } from './masters/master.entity';
import { Camera } from './cameras/camera.entity';
import { Detection } from './detections/detection.entity';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return {
                    type: 'mysql',
                    host: configService.get<string>('DB_HOST'),
                    port: configService.get<number>('DB_PORT'),
                    username: configService.get<string>('DB_USER'),
                    password: configService.get<string>('DB_PASSWORD'),
                    database: configService.get<string>('DB_NAME'),
                    entities: [Detection, Master, Camera],
                    synchronize: true,
                    logging: false,
                };
            },
        }),
        MastersModule,
        CamerasModule,
        DetectionsModule,
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
