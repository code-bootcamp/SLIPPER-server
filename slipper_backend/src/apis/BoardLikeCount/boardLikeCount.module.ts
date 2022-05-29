import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../Board/board.entity';
import { Join } from '../join/entities/join.entity';
import { BoardLikeCount } from './boardLikeCount.entity';
import { BoardLikeCountResolver } from './boardLikeCount.resolver';
import { BoardLikeCountService } from './boardLikeCount.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardLikeCount, Join])],
  providers: [
    BoardLikeCountResolver, //
    BoardLikeCountService,
  ],
})
export class BoardLikeCountModule {}
