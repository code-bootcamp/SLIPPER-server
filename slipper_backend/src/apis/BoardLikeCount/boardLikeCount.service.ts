import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Board } from '../Board/board.entity';
import { Join } from '../join/entities/join.entity';
import { BoardLikeCount } from './boardLikeCount.entity';

@Injectable()
export class BoardLikeCountService {
  constructor(
    @InjectRepository(BoardLikeCount)
    private readonly boardLikeCountRepository: Repository<BoardLikeCount>,

    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async likeCountChange({ boardId, currentUser }) {
    const checkBoardLike = await this.boardLikeCountRepository.findOne({
      where: { board: boardId, join: currentUser.id },
    });

    console.log(currentUser);

    if (checkBoardLike === undefined) {
      await this.boardLikeCountRepository.save({
        board: boardId,
        join: currentUser.id,
      });

      const findBoard = await this.boardRepository.findOne({
        id: boardId,
      });

      await this.boardRepository.save({
        id: boardId,
        likeCount: findBoard.likeCount + 1,
      });

      return 1;
    } else {
      await this.boardLikeCountRepository.delete({
        board: boardId,
        join: currentUser.id,
      });

      const findBoard = await this.boardRepository.findOne({
        id: boardId,
      });

      await this.boardRepository.save({
        id: boardId,
        likeCount: findBoard.likeCount - 1,
      });

      return -1;
    }
  }

  async likeCountTotal({ boardId }) {
    const findBoard = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    console.log('hi');
    console.log(findBoard.likeCount);
    return findBoard.likeCount;
  }

  //   async like({ boardId, currentUser }) {
  //     try {
  //     } catch {}
  //     const user = await this.joinRepository.findOne({
  //       where: { id: currentUser.id },
  //     });

  //     const board = await this.boardRepository.findOne({
  //       where: { id: boardId },
  //     });

  //     const likeBoard = await this.boardLikeRepository.findOne({
  //       where: { board: boardId, join: currentUser.id },
  //     });

  //     if (!likeBoard) {
  //       await this.boardLikeRepository.save({
  //         isLike: true,
  //         board: board,
  //         join: user,
  //       });

  //       const userCount = await this.boardLikeRepository.count({
  //         join: currentUser.id,
  //       });

  //       await this.joinRepository.save({
  //         ...user,
  //         likeList: userCount,
  //       });

  //       const likeCount = await this.boardLikeRepository.count({
  //         board: boardId,
  //       });

  //       const newBoard = await this.boardRepository.save({
  //         ...board,
  //         likeCount,
  //       });

  //       console.log(likeCount);
  //       //return newBoard;
  //       return likeCount; // 성환 추가
  //     }
  //     if (likeBoard) {
  //       const newLikeBoard = await this.boardLikeRepository.delete({
  //         id: likeBoard.id,
  //       });

  //       // 성환 추가
  //       const likeCount = await this.boardLikeRepository.count({
  //         board: boardId,
  //       });

  //       const userCount = await this.boardLikeRepository.count({
  //         join: currentUser.id,
  //       });

  //       await this.joinRepository.save({
  //         ...user,
  //         likeList: userCount,
  //       });

  //       newLikeBoard.affected
  //         ? `[삭제 성공] ${likeBoard.id}`
  //         : `[삭제실패] ${likeBoard.id}`;
  //       const newBoard = await this.boardRepository.save({
  //         ...board,
  //         userCount,
  //       });

  //       //return newBoard;
  //       return likeCount; // 성환 추가
  //     }
  //   }

  //   async fetchLikeBoards({ currentUser }) {
  //     return await getRepository(BoardLike)
  //       .createQueryBuilder('boardLike')
  //       .innerJoinAndSelect('boardLike.join', 'join')
  //       .innerJoinAndSelect('boardLike.board', 'board')
  //       .where('join.id = :userId', { userId: currentUser.id })
  //       .orderBy('boardLike.createAt', 'DESC')
  //       .getMany();
  //   }

  //   async fetchLikeBoardsLength({ boardId }) {
  //     return await this.boardLikeRepository.count({ board: boardId });
  //   }
}
