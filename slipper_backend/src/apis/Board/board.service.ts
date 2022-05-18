import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(BoardImage)
    private readonly boardImageRepository: Repository<BoardImage>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async findOne({ boardId }) {
    return await this.boardRepository.findOne({
      where: { id: boardId }, //
      relations: ['images'],
    });
  }

  // async findAll() {
  //   return await this.boardRepository.find();
  // }

  //무한스크롤
  async loadPage({ page, category, search }) {
    console.log(page);

    // const result = await this.boardRepository //
    //   .createQueryBuilder('board')
    //   .where('board.tag = :tag', { tag: tag });
    //   .skip(5)
    // .take(10)
    // .getMany();

    // console.log(result);
  }

  //게시글 작성
  async create({ createBoardInput }) {
    const findUserId = await this.joinRepository.findOne({
      nickname: createBoardInput.nickname,
    });

    const userId = {
      id: findUserId.id,
      email: findUserId.email,
      nickname: findUserId.nickname,
      phone: findUserId.phone,
    };
    console.log('asdfasdfsadf');

    const result = await this.boardRepository.save({
      user: findUserId.id,
      ...createBoardInput,
    });

    console.log(result);

    const boardId = result.id;
    const images = result.images;

    const returnImagelist = [];
    const saveImage = await Promise.all(
      images.map(async (el) => {
        //console.log(el);

        //DB에 이미 존재하는 imageURL 인지 확인하기
        const checkDuplicates = await this.boardImageRepository.findOne({
          imageUrl: el,
        });

        //만약에 DB에 일치하는게 없을 시에만 저장하기
        if (checkDuplicates === undefined) {
          return new Promise(async (resolve, reject) => {
            const savedImage = await this.boardImageRepository.save({
              imageUrl: el,
              board: boardId,
            });
            returnImagelist.push(savedImage);

            if (savedImage) resolve(savedImage);
            else reject('에러');
          });
        } else {
          returnImagelist.push({ id: boardId, imageUrl: `[중복] ${el}` });
          return `[중복] ${el}`;
        }
      }),
    );
    //console.log(returnImagelist);
    result.user = userId;
    result.images = returnImagelist;
    return result;
  }

  //게시글 수정
  async update({ boardId, updateBoardInput }) {
    // const oldBoard = await this.boardRepository.findOne({
    //   where: { id: boardId },
    // });

    // const newBoard = {
    //   ...oldBoard,
    //   ...updateBoardInput,
    // };

    // const result = await this.boardRepository.save({
    //   ...newBoard,
    // });
    // console.log(result);
    // return result;

    const test = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['images'],
    });

    console.log(test);
    return test;
  }

  //게시글 삭제
  async delete({ boardId }) {
    const result = await this.boardRepository.delete({ id: boardId });
    return result.affected
      ? `[삭제 성공] ${boardId}`
      : `[삭제 실패] ${boardId}`;
  }
}
