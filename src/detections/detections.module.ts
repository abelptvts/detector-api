import { Module } from '@nestjs/common';
import { DetectionsController } from './detections.controller';
import { DetectionsService } from './detections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detection } from './detection.entity';
import { Camera } from '../cameras/camera.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Detection, Camera])],
    controllers: [DetectionsController],
    providers: [DetectionsService],
})
export class DetectionsModule {}
