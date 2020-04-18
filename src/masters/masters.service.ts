import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Master } from './master.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MastersService {
    constructor(
        @InjectRepository(Master)
        private mastersRepository: Repository<Master>,
    ) {}

    async findByInstallationId(installationId: string): Promise<Master> {
        const master = await this.mastersRepository.findOne({
            where: { installationId },
        });
        return master || null;
    }

    async createMaster(
        installationId: string,
        name: string,
        expoPushToken: string,
    ): Promise<Master> {
        const master = new Master();
        master.installationId = installationId;
        master.name = name;
        master.expoPushToken = expoPushToken;

        await this.mastersRepository.save(master);
        return master;
    }
}
