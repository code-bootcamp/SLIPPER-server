import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';
import { getToday } from 'src/commons/libraries/utils';
import { Board } from '../Board/board.entity';

@Injectable()
export class TestBoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(BoardImage)
    private readonly boardImageRepository: Repository<BoardImage>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async findAll() {
    const result = await this.boardRepository.find({
      relations: ['images'],
    });
    console.log(result);
    return result;
  }

  async create({ createBoardInput, email }) {
    const findUserId = await this.joinRepository.findOne({
      email: email,
    });

    console.log(getToday());
    createBoardInput.createdAt = getToday();
    //console.log(createBoardInput);

    let thumbnail;
    if (createBoardInput.images.length > 0) {
      thumbnail = createBoardInput.images[0];
    } else {
      thumbnail = null;
    }

    /*
    나중에 교체해야할 코드
    const findUserId = await this.joinRepository.findOne({
      nickname: currentUser.nickname,
    });
    */

    const userId = {
      id: findUserId.id,
      email: findUserId.email,
      nickname: findUserId.nickname,
      phone: findUserId.phone,
    };

    console.log('-=-=-=-=-=-');
    console.log(createBoardInput);

    const result = await this.boardRepository.save({
      user: findUserId.id,
      thumbnail: thumbnail,
      nickname: findUserId.nickname,
      ...createBoardInput,
    });

    console.log(result);

    const boardId = result.id;
    const images = result.images;

    const returnImagelist = [];
    if (createBoardInput.images.length > 0) {
      await Promise.all(
        images.map(async (el) => {
          return new Promise(async (resolve, reject) => {
            const savedImage = await this.boardImageRepository.save({
              imageUrl: el,
              board: boardId,
            });
            returnImagelist.push(savedImage);

            if (savedImage) resolve(savedImage);
            else reject('에러');
          });
        }),
      );
    }

    result.user = userId;
    result.images = returnImagelist;
    result.nickname = userId.nickname;

    return result;
  }
}
