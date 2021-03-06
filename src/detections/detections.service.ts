import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Detection } from './detection.entity';
import { Camera } from '../cameras/camera.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsService } from '../masters/notifications.service';
import { Master } from '../masters/master.entity';

@Injectable()
export class DetectionsService {
    constructor(
        @InjectRepository(Detection)
        private detectionsRepository: Repository<Detection>,
        @InjectRepository(Camera)
        private camerasRepository: Repository<Camera>,
        @InjectRepository(Master)
        private mastersRepository: Repository<Master>,
        private notificationsService: NotificationsService,
    ) {}

    async createDetection(
        camera: Camera,
        filename: string,
        date: Date,
    ): Promise<Detection> {
        const now = new Date();

        const detection = new Detection();
        detection.camera = camera;
        detection.capture = `/captures/${filename}`;
        detection.date = date;
        await this.detectionsRepository.save(detection);

        camera.lastDetection = now;
        await this.camerasRepository.save(camera);

        delete detection.camera;

        const masters = await this.mastersRepository
            .createQueryBuilder('master')
            .innerJoin('master.cameras', 'camera')
            .where('camera.id = :cameraId', { cameraId: camera.id })
            .getMany();

        for (const master of masters) {
            this.notificationsService.queueNotification(
                master.expoPushToken,
                `${camera.name} has new detections!`,
            );
        }

        return detection;
    }

    async getDetections(
        installationId: string,
        offset = 0,
        limit = 10,
    ): Promise<Detection[]> {
        return await this.detectionsRepository
            .createQueryBuilder('detection')
            .select(['detection', 'camera'])
            .innerJoin('detection.camera', 'camera')
            .innerJoin('camera.masters', 'master')
            .where('master.installationId = :installationId', {
                installationId,
            })
            .skip(offset)
            .take(limit)
            .orderBy('detection.date', 'DESC')
            .getMany();
    }
}
