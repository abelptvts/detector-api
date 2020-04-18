import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Camera } from './camera.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Master } from '../masters/master.entity';
import { Detection } from '../detections/detection.entity';

@Injectable()
export class CamerasService {
    constructor(
        @InjectRepository(Camera)
        private camerasRepository: Repository<Camera>,
        @InjectRepository(Master)
        private mastersRepository: Repository<Master>,
        @InjectRepository(Detection)
        private detectionsRepository: Repository<Detection>,
    ) {}

    async findById(id: number): Promise<Camera> {
        const camera = await this.camerasRepository.findOne({ where: { id } });
        return camera || null;
    }

    async createCamera(master: Master, name: string, description: string) {
        const camera = new Camera();
        camera.name = name;
        camera.description = description;
        camera.masters = [master];
        await this.camerasRepository.save(camera);
        return camera;
    }

    private async cameraBelongsToMaster(
        cameraId,
        installationId,
    ): Promise<boolean> {
        const cameraOfMaster = await this.mastersRepository
            .createQueryBuilder('master')
            .select('camera.id')
            .innerJoin('master.cameras', 'camera')
            .where(
                'master.installationId = :installationId and camera.id = :cameraId',
                { installationId, cameraId },
            )
            .getOne();

        return cameraOfMaster !== null;
    }

    async updateCamera(
        id: number,
        name: string,
        description: string,
        enabled: boolean,
        connected: boolean,
        installationId: string,
    ): Promise<Camera> {
        const camera = await this.camerasRepository.findOne({ where: { id } });

        if (
            !camera ||
            !(await this.cameraBelongsToMaster(id, installationId))
        ) {
            throw new NotFoundException('Camera not found.');
        }

        if (name !== null) {
            camera.name = name;
        }

        if (description !== null) {
            camera.description = description;
        }

        if (enabled !== null) {
            camera.enabled = enabled;
        }

        if (connected !== null) {
            camera.connected = connected;
        }

        await this.camerasRepository.save(camera);
        return camera;
    }

    async getDetectionsOf(
        id: number,
        installationId: string,
        offset = 0,
        limit = 10,
    ): Promise<Detection[]> {
        const camera = await this.camerasRepository.findOne({ where: { id } });

        if (
            !camera ||
            !(await this.cameraBelongsToMaster(id, installationId))
        ) {
            throw new NotFoundException('Camera not found.');
        }

        return this.detectionsRepository
            .createQueryBuilder('detection')
            .innerJoin('detection.camera', 'camera')
            .where('camera.id = :id', { id })
            .skip(offset)
            .take(limit)
            .orderBy('detection.date', 'DESC')
            .getMany();
    }

    async getCameras(
        installationId,
        offset = 0,
        limit = 10,
    ): Promise<Camera[]> {
        return this.camerasRepository
            .createQueryBuilder('camera')
            .innerJoin('camera.masters', 'master')
            .where('master.installationId = :installationId', {
                installationId,
            })
            .skip(offset)
            .take(limit)
            .orderBy('camera.lastDetection', 'DESC')
            .getMany();
    }
}
