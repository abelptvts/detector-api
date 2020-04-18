import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { MastersService } from '../masters/masters.service';
import { JwtService } from '@nestjs/jwt';
import { Master } from '../masters/master.entity';
import { TokenResultDTO } from './dto/token.result.dto';
import { Camera } from '../cameras/camera.entity';
import { CamerasService } from '../cameras/cameras.service';
import { ROLES } from '../common/constants';

@Injectable()
export class AuthService {
    constructor(
        private mastersService: MastersService,
        private camerasService: CamerasService,
        private jwtService: JwtService,
    ) {}

    async validateMaster(installationId: string): Promise<Master> {
        return this.mastersService.findByInstallationId(installationId);
    }

    async validateCamera(id: number): Promise<Camera> {
        return this.camerasService.findById(id);
    }

    private async createToken(id, role): Promise<TokenResultDTO> {
        return {
            token: await this.jwtService.signAsync({
                id,
                role,
            }),
        };
    }

    async loginMaster(installationId: string): Promise<TokenResultDTO> {
        const master = await this.mastersService.findByInstallationId(
            installationId,
        );

        if (master === null) {
            throw new UnauthorizedException();
        }

        return this.createToken(installationId, ROLES.MASTER);
    }

    async registerMaster(
        installationId: string,
        name: string,
        expoPushToken: string,
    ): Promise<TokenResultDTO> {
        const existing = await this.mastersService.findByInstallationId(
            installationId,
        );
        if (existing !== null) {
            throw new BadRequestException(
                'There already is a master with the provided installationId.',
            );
        }

        const master = await this.mastersService.createMaster(
            installationId,
            name,
            expoPushToken,
        );

        return this.createToken(master.installationId, ROLES.MASTER);
    }

    async registerCamera(
        master: Master,
        name: string,
        description: string,
    ): Promise<TokenResultDTO> {
        const camera = await this.camerasService.createCamera(
            master,
            name,
            description,
        );

        return this.createToken(camera.id, ROLES.CAMERA);
    }
}
