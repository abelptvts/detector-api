import { Module } from '@nestjs/common';
import { DetectionsController } from './detections.controller';
import { DetectionsService } from './detections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detection } from './detection.entity';
import { Camera } from '../cameras/camera.entity';
import { Master } from '../masters/master.entity';
import { MastersModule } from '../masters/masters.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Detection, Camera, Master]),
        MastersModule,
    ],
    controllers: [DetectionsController],
    providers: [DetectionsService],
})
export class DetectionsModule {}
