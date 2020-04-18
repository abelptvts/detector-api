import { Module } from '@nestjs/common';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camera } from './camera.entity';
import { Master } from '../masters/master.entity';
import { Detection } from '../detections/detection.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Camera, Master, Detection])],
    controllers: [CamerasController],
    providers: [CamerasService],
    exports: [CamerasService],
})
export class CamerasModule {}
