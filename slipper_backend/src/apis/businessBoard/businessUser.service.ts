import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getToday } from 'src/commons/libraries/utils';
import { Repository } from 'typeorm';
import { Board } from '../Board/board.entity';
import { Join } from '../join/entities/join.entity';
import { BusinessBoard } from './entities/businessBoard.entity';

@Injectable()
export class BusinessUserService {
  constructor(
    @InjectRepository(BusinessBoard)
    private readonly businessBoardRepository: Repository<BusinessBoard>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async createBusinessBoard({ createBusinessBoardInput, email }) {
    const checkBusinessUser = await this.joinRepository.findOne({
      email,
    });

    const businessUser = {
      id: checkBusinessUser.id,
      nickname: checkBusinessUser.nickname,
    };

    createBusinessBoardInput.createAt = getToday();

    let thumbnail;

    if (createBusinessBoardInput.images.length > 0) {
      thumbnail = createBusinessBoardInput.images[0];
    } else {
      thumbnail = null;
    }
  }
}
