import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Role } from '../common/role.decorator';
import { ROLES } from '../common/constants';
import { CurrentUser } from '../common/current.user.decorator';
import { Master } from '../masters/master.entity';
import { CamerasService } from './cameras.service';
import { Camera } from './camera.entity';
import { UpdateCameraDto } from './dto/update.camera.dto';
import { CamerasGateway } from './cameras.gateway';

@Controller('cameras')
export class CamerasController {
    constructor(
        private camerasService: CamerasService,
        private camerasGateway: CamerasGateway,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Role(ROLES.MASTER)
    @Patch('/:id')
    async updateCamera(
        @Body() payload: UpdateCameraDto,
        @Param('id') id: number,
        @CurrentUser() master: Master,
    ) {
        if (payload.enabled !== null) {
            await this.camerasGateway.toggleCamera(id, payload.enabled);
        }
        return this.camerasService.updateCamera(
            id,
            payload.name,
            payload.description,
            payload.enabled,
            null,
            master.installationId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Role(ROLES.CAMERA)
    @Get('/me')
    async getMe(@CurrentUser() camera: Camera) {
        return camera;
    }

    @UseGuards(JwtAuthGuard)
    @Role(ROLES.MASTER)
    @Get('/')
    async getCameras(
        @CurrentUser() master: Master,
        @Query('offset') offset = 0,
        @Query('limit') limit = 10,
    ) {
        return this.camerasService.getCameras(
            master.installationId,
            offset,
            limit,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Role(ROLES.MASTER)
    @Delete('/:id')
    async deleteCamera(
        @Param('id') id: number,
        @CurrentUser() master: Master,
    ): Promise<Camera> {
        return this.camerasService.deleteCamera(id, master.installationId);
    }
}
