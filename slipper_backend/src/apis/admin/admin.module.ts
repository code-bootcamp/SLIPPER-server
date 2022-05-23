import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../Board/board.entity';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';
import { AdminResolver } from './admin.resiolver';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardImage, Join])],
  providers: [
    AdminService, //
    AdminResolver,
  ],
})
export class AdminModule {}
