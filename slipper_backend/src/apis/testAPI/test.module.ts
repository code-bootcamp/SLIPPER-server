import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../Board/board.entity';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';
import { TestAPIResolver } from './test.resolver';
import { TestBoardService } from './test.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardImage, Join])],
  providers: [TestAPIResolver, TestBoardService],
})
export class TestAPIModule {}
