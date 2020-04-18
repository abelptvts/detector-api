import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JWTPayload } from './auth/JWTPayload';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { Role } from './common/role.decorator';
import { ROLES } from './common/constants';
import { CurrentUser } from './common/current.user.decorator';
import { Master } from './masters/master.entity';
import { RegisterMasterDto } from './auth/dto/register.master.dto';
import { RegisterCameraDto } from './auth/dto/register.camera.dto';

@Controller()
export class AppController {
    constructor(private authService: AuthService) {}

    @Post('masters/login')
    async login(@Body() payload: JWTPayload) {
        return this.authService.loginMaster(payload.id as string);
    }

    @Post('masters/')
    async registerMaster(@Body() payload: RegisterMasterDto) {
        return this.authService.registerMaster(
            payload.installationId,
            payload.name,
            payload.expoPushToken,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Role(ROLES.MASTER)
    @Post('cameras/')
    async registerCamera(
        @CurrentUser() master: Master,
        @Body() payload: RegisterCameraDto,
    ) {
        return this.authService.registerCamera(
            master,
            payload.name,
            payload.description,
        );
    }
}
