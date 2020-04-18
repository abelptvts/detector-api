import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Role } from '../common/role.decorator';
import { ROLES } from '../common/constants';

@Controller('masters')
export class MastersController {
    @UseGuards(JwtAuthGuard)
    @Role(ROLES.MASTER)
    @Get('/')
    getMasters(@Req() request) {
        return {
            message: request.user,
        };
    }
}
