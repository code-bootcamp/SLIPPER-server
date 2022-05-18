import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Storage } from '@google-cloud/storage';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';

@Injectable()
export class CrontabService {
  constructor(
    @InjectRepository(BoardImage)
    private readonly boardImageRepository: Repository<BoardImage>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  private readonly logger = new Logger(CrontabService.name);

  @Cron('* * 1 * *')
  async runningCron() {
    /*
      참고: https://docs.nestjs.com/techniques/task-scheduling
      * * 1 * *   매달 1일
      * * * * 1   매주 월요일

    * * * * * *
    | | | | | |
    | | | | | day of week
    | | | | months
    | | | day of month
    | | hours
    | minutes
    seconds (optional)
    */

    // Google Storage에 안쓰이는 이미지 한번에 정리하기 (매달 1회)
    const date = new Date();
    console.log(date);
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);

    async function googleStorageFiles() {
      const [files] = await storage.getFiles();

      const result = files.map((e) => {
        return e.name;
      });

      return result;
    }

    const googleLinks = await googleStorageFiles();

    const boardImageLinks = await this.boardImageRepository
      .createQueryBuilder('board_image')
      .select(['board_image.imageUrl'])
      .getMany();

    const profileImageLinks = await this.joinRepository
      .createQueryBuilder('join')
      .select(['join.imageUrl'])
      .getMany();

    const databaseImageLinks = [...boardImageLinks, ...profileImageLinks];

    for (let i = 0; i < googleLinks.length; i++) {
      let check = true;
      for (let x = 0; x < databaseImageLinks.length; x++) {
        if (
          `https://storage.googleapis.com/slipper-storage/${googleLinks[i]}` ===
          databaseImageLinks[x].imageUrl
        ) {
          check = false;
          break;
        }
      }

      // DB에 없는 이미지는 구글 스토리지에서 삭제
      if (check) {
        const front = googleLinks[i].split('/')[0];
        const back = googleLinks[i].split('/')[1].split('/')[0];
        const link = `${front}/${back}/`;
        console.log(`삭제완료 - ${link}`);
        await storage.deleteFiles({
          prefix: link,
        });
      }
    }
  }
}
