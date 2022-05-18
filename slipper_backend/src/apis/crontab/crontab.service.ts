import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class CrontabService {
  private readonly logger = new Logger(CrontabService.name);

  @Cron('* * 1 * *')
  runningCron() {
    console.log('김태영 바보');
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
    console.log('hello!!!!!');
    const storage = new Storage();

    async function googleStorageFiles() {
      const [files] = await storage
        .bucket(process.env.STORAGE_BUCKET)
        .getFiles();

      const result = files.map((e) => {
        return e.name;
      });
      console.log(result);
      return result;
    }

    const googleLinks = googleStorageFiles();

    /*
        이후에는 사용자가 작성한 게시글id 와 이미지 링크들 합친 이미지링크 테이블 전체목록을 불러와서
        비교 후, 차이나는 이미지들만 삭제하기
        https://cloud.google.com/storage/docs/deleting-objects#code-samples

        const storage = new Storage();
        async function deleteFile() {
        await storage.bucket(bucketName).file(fileName).delete();

        console.log(`gs://${bucketName}/${fileName} deleted`);
        }

        deleteFile().catch(console.error);
    */
  }
}
