import { Module } from '@nestjs/common';
import { MastersController } from './masters.controller';
import { MastersService } from './masters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Master } from './master.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Master])],
    controllers: [MastersController],
    providers: [MastersService],
    exports: [MastersService],
})
export class MastersModule {}
