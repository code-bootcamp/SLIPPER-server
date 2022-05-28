import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { getToday } from 'src/commons/libraries/utils';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(BoardImage)
    private readonly boardImageRepository: Repository<BoardImage>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async findOne({ boardId }) {
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.images', 'images')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.comment', 'comment')
      .leftJoinAndSelect('comment.subComment', 'subComment')
      .where('board.id = :id', { id: boardId })
      .getOne();

    return result;
  }

  async loadPage({ category, search, sortType, page }) {
    const skip = (page - 1) * 10;

    let type: any;
    if (sortType === 'like') {
      type = 'likecount:desc';
    } else {
      type = 'createdat:desc';
    }

    let result: any;
    if (search === undefined || search === null || search === '') {
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: type,
        query: {
          match_all: {},
        },

        from: skip,
        size: 10,
      });
    } else if (category === undefined || category === null || category === '') {
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: type,
        query: {
          prefix: { address: search },
        },

        from: skip,
        size: 10,
      });
    } else {
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: type,
        query: {
          bool: {
            must: [
              { prefix: { address: search } },
              { match: { category: category } },
            ],
          },
        },

        from: skip,
        size: 10,
      });
    }

    return result.hits.hits;
  }

  async create({ createBoardInput, email }) {
    const findUserId = await this.joinRepository.findOne({
      email: email,
    });
    createBoardInput.createdAt = new Date(getToday());

    let thumbnail;
    if (createBoardInput.images.length > 0) {
      thumbnail = createBoardInput.images[0];
    } else {
      thumbnail = null;
    }

    const userId = {
      id: findUserId.id,
      email: findUserId.email,
      nickname: findUserId.nickname,
      phone: findUserId.phone,
    };

    const result = await this.boardRepository.save({
      user: findUserId.id,
      thumbnail: thumbnail,
      nickname: findUserId.nickname,
      ...createBoardInput,
    });

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

            console.log(returnImagelist);

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

  async update({ boardId, updateBoardInput }) {
    const { images: newImages, ...newData } = updateBoardInput;

    const oldBoard = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['images', 'user'],
    });
    const { images: oldImages, user, ...oldData } = oldBoard;

    if (newImages[0] !== oldImages[0]) {
      newData.thumbnail = newImages[0];
    } else if (newImages.length === 0) {
      newData.thumbnail = null;
    }

    const newBoard = {
      ...oldData,
      ...newData,
      updatedAt: new Date(getToday()),
    };

    const result = await this.boardRepository.save({
      ...newBoard,
    });

    const returnImages = [];
    if (newImages !== undefined) {
      const saveNewImages = [];
      const deleteImages = [];
      const filteredImages = [];

      for (const e of oldImages) {
        if (!newImages.includes(e.imageUrl)) deleteImages.push(e.id);
        else {
          filteredImages.push(e.imageUrl);
          returnImages.push({
            id: e.id,
            imageUrl: e.imageUrl,
          });
        }
      }

      for (const e of newImages) {
        if (!filteredImages.includes(e)) saveNewImages.push(e);
      }

      for (const e of deleteImages) {
        await this.boardImageRepository.delete({ id: e });
      }

      for (const e of saveNewImages) {
        const resultImages = await this.boardImageRepository.save({
          imageUrl: e,
          board: boardId,
        });

        returnImages.push({
          id: resultImages.id,
          imageUrl: resultImages.imageUrl,
        });
      }
    }

    const returnUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      nickname: user.nickname,
    };

    result.user = returnUser;
    result.images = returnImages;

    return result;
  }

  async delete({ boardId }) {
    try {
      const findBoard = await this.boardRepository.findOne({
        where: { id: boardId },
      });

      await this.elasticsearchService.delete({
        index: 'slipper-elasticsearch',
        id: boardId,
      });

      await this.boardRepository.delete({
        id: boardId,
      });

      return `[삭제 성공] 제목: ${findBoard.title}`;
    } catch (e) {
      return `[이미 삭제된 글 입니다] ${boardId}`;
    }
  }

  async fetchUserBoards({ currentUser, page }) {
    return await getRepository(Board)
      .createQueryBuilder('board')
      .innerJoinAndSelect('board.user', 'user')
      .where('user.id = :userId', { userId: currentUser.id })
      .orderBy('board.createdAt', 'DESC')
      .limit(10)
      .offset(10 * (page - 1))
      .getMany();
  }

  async likeBoardsArray({ page }) {
    return await getRepository(Board)
      .createQueryBuilder('board')
      .orderBy('board.likeCount', 'DESC')
      .addOrderBy('board.createdAt', 'DESC')
      .limit(10)
      .offset(10 * (page - 1))
      .getMany();
  }
}
