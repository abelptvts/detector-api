import { Module } from '@nestjs/common';
import { MastersController } from './masters.controller';
import { MastersService } from './masters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Master } from './master.entity';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [TypeOrmModule.forFeature([Master])],
    controllers: [MastersController],
    providers: [MastersService, NotificationsService],
    exports: [MastersService, NotificationsService],
})
export class MastersModule {}
