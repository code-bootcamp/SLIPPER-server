import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../Board/board.entity';
import { Join } from '../join/entities/join.entity';
import { BoardLike } from './entities/boardLike.entity';

@Injectable()
export class BoardLikeService {
  constructor(
    @InjectRepository(BoardLike)
    private readonly boardLikeRepository: Repository<BoardLike>,

    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async like({ boardId, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser.id },
    });

    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    const likeBoard = await this.boardLikeRepository.findOne({
      where: { board: boardId, user: currentUser.id },
    });
    if (!likeBoard) {
      const newLikeBoard = await this.boardLikeRepository.save({
        isLike: true,
        board: board,
        join: user,
      });
    }
  }
}
