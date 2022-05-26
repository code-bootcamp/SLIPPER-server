import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { getToday } from 'src/commons/libraries/utils';
import { CurrentUser } from 'src/commons/auth/gql-user.param';

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
    return await this.boardRepository.findOne({
      where: { id: boardId, isDeleted: 'N' }, //
      relations: ['images', 'user'],
    });
  }

  //검색 결과를 전달해주기 + (X 무한 스크롤)
  async loadPage({ category, search }) {
    //const skip = (page - 1) * 10;

    let result: any;
    if (search === undefined || search === null || search === '') {
      //전체 글 기준으로 전달 (검색페이지 메인)
      console.log(1);
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: 'createdat:desc',
        query: {
          bool: {
            must: [{ match: { isdeleted: 'N' } }],
          },
          //match_all: {},
        },

        // from: skip,
        from: 0,
        size: 10000,
      });
    } else if (category === undefined || category === null || category === '') {
      // 검색결과를 기준으로 전달 = 검색키워드
      console.log(2);
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: 'createdat:desc',
        query: {
          bool: {
            must: [
              { match: { isdeleted: 'N' } },
              { prefix: { address: search } },
            ],
          },
        },

        // from: skip,
        from: 0,
        size: 10000,
      });
    } else {
      // 검색결과를 기준으로 전달 = 검색키워드 + 카테고리
      console.log(3);
      result = await this.elasticsearchService.search({
        index: 'slipper-elasticsearch',
        sort: 'createdat:desc',
        query: {
          bool: {
            must: [
              { match: { isdeleted: 'N' } },
              { prefix: { address: search } },
              { prefix: { category: category } },
            ],
          },
        },

        // from: skip,
        from: 0,
        size: 10000,
      });
    }

    return result.hits.hits;
  }

  //게시글 작성
  async create({ createBoardInput, email }) {
    const findUserId = await this.joinRepository.findOne({
      email: email,
    });

    console.log(getToday());
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

  //게시글 수정
  async update({ boardId, updateBoardInput }) {
    //----- 기존 데이터와 새로운 데이터를 분리해놓기
    const { images: newImages, ...newData } = updateBoardInput;

    const oldBoard = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['images', 'user'],
    });
    const { images: oldImages, user, ...oldData } = oldBoard;

    // 첫번째 이미지가 수정되었을 때 썸네일용 이미지도 변경
    if (newImages[0] !== oldImages[0]) {
      newData.thumbnail = newImages[0];
    } else if (newImages.length === 0) {
      newData.thumbnail = null;
    }

    //----- 수정된 내용 합치기
    const newBoard = {
      ...oldData,
      ...newData,
      updatedAt: new Date(getToday()),
    };

    //----- 수정된 내용 게시글로 저장하기
    const result = await this.boardRepository.save({
      ...newBoard,
    });

    //----- 수정된 이미지 삭제하기
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

    //----- 수정된 내용 프론트에 전달하기
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

  //게시글 삭제
  async delete({ boardId }) {
    // const findBoard = await this.boardRepository.findOne({
    //   where: { id: boardId },
    //   relations: ['images'],
    // });
    // const findImages = findBoard.images;

    // //이미지 먼저 삭제
    // for (const e of findImages) {
    //   console.log(e.id);
    //   await this.boardImageRepository.delete({ id: e.id });
    // }

    // //최종 게시글 삭제
    // const result = await this.boardRepository.delete({ id: boardId });

    // softDelete 방식
    const findBoard = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (findBoard.isDeleted !== 'N') {
      return `[이미 삭제된 글 입니다] 제목: ${findBoard.title}`;
    }

    await this.boardRepository.save({
      id: boardId,
      isDeleted: 'Y',
    });
    return `[삭제 성공] 제목: ${findBoard.title}`;
  }

  async fetchUserBoards({ currentUser }) {
    return await getRepository(Board)
      .createQueryBuilder('board')
      .innerJoinAndSelect('board.user', 'user')
      .where('user.id = :userId', { userId: currentUser.id })
      .orderBy('board.createdAt', 'DESC')
      // .limit(10)
      // .offset(10 * (page - 1))
      .getMany();
  }
}
