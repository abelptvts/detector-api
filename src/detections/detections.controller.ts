import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Role } from '../common/role.decorator';
import { ROLES } from '../common/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../common/current.user.decorator';
import { DetectionsService } from './detections.service';
import { Camera } from '../cameras/camera.entity';

@Controller('detections')
export class DetectionsController {
    constructor(private detectionsService: DetectionsService) {}

    @UseGuards(JwtAuthGuard)
    @Role(ROLES.CAMERA)
    @Post('/')
    @UseInterceptors(FileInterceptor('capture', { dest: './upload/' }))
    async createDetection(
        @CurrentUser() camera: Camera,
        @UploadedFile() capture,
    ) {
        return this.detectionsService.createDetection(camera, capture.filename);
    }
}
