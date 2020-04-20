import {
    Body,
    Controller,
    Get,
    Post,
    Query,
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
import { CreateDetectionDto } from './dto/create.detection.dto';
import { Master } from '../masters/master.entity';

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
        @Body() payload: CreateDetectionDto,
    ) {
        return this.detectionsService.createDetection(
            camera,
            capture.filename,
            new Date(payload.date),
        );
    }

    @UseGuards(JwtAuthGuard)
    @Role(ROLES.MASTER)
    @Get('/')
    async getDetections(
        @CurrentUser() master: Master,
        @Query('offset') offset = 0,
        @Query('limit') limit = 10,
    ) {
        return this.detectionsService.getDetections(
            master.installationId,
            offset,
            limit,
        );
    }
}
