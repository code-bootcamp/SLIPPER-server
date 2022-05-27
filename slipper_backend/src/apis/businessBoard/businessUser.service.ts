import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getToday } from 'src/commons/libraries/utils';
import { Repository } from 'typeorm';
import { BusinessBoardImage } from '../BusinessBoardImage/entities/BusinessBoardImage.entity';
import { Join } from '../join/entities/join.entity';
import { BusinessBoard } from './entities/businessBoard.entity';

@Injectable()
export class BusinessUserService {
  constructor(
    @InjectRepository(BusinessBoard)
    private readonly businessBoardRepository: Repository<BusinessBoard>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,

    @InjectRepository(BusinessBoardImage)
    private readonly businessBoardImage: Repository<BusinessBoardImage>,
  ) {}

  async create({ createBusinessBoardInput, email }) {
    const checkBusinessUser = await this.joinRepository.findOne({
      email,
    });

    const businessUser = {
      id: checkBusinessUser.id,
      nickname: checkBusinessUser.nickname,
    };

    createBusinessBoardInput.createAt = new Date(getToday());

    let thumbnail;

    if (createBusinessBoardInput.images.length > 0) {
      thumbnail = createBusinessBoardInput.images[0];
    } else {
      thumbnail = null;
    }

    const result = await this.businessBoardRepository.save({
      user: businessUser.id,
      thumbnail: thumbnail,
      nickname: businessUser.nickname,
      ...createBusinessBoardInput,
    });

    const imageList = [];
    const images = createBusinessBoardInput.images;
    if (createBusinessBoardInput.images.length > 0) {
      await Promise.all(
        images.map(async (el) => {
          return new Promise(async (resolve, reject) => {
            const saveImage = await this.businessBoardImage.save({
              imageUrl: el,
              businessBoard: result.id,
            });
            imageList.push(saveImage);
            if (saveImage) resolve(saveImage);
            else reject('에러');
          });
        }),
      );
    }
    return result;
  }
}
