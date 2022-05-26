import axios from 'axios';
import {
  ConflictException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Join } from '../join/entities/join.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './payment.entity';
import { getToday } from 'src/commons/libraries/utils';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,

    private readonly connection: Connection,
  ) {}

  async getToken() {
    try {
      const result = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IAMPORT_API_KEY,
        imp_secret: process.env.IAMPORT_SECRET,
      });
      console.log(
        `[success] 토큰 받기 성공!! ${result.data.response.access_token}`,
      );

      return result.data.response.access_token;
    } catch (error) {
      console.log('🚨🚨  getToken 오류 발생  🚨🚨');
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }

  async checkPaid({ impUid, token, amount }) {
    try {
      /* 아임포트 REST API로 결제 요청 */
      const result = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`,
        { headers: { Authorization: token } },
      );

      if (result.data.response.status !== 'paid')
        throw new ConflictException(`결제 내역이 존재하지 않습니다. [${result.data.response.status} !== 'paid']
        `);

      if (result.data.response.amount !== amount)
        throw new UnprocessableEntityException(`결제 금액이 잘못되었습니다. [${result.data.response.amount} !== ${amount}]
        `);
    } catch (error) {
      console.log('🚨🚨  checkPaid 오류 발생  🚨🚨');
      if (error?.response?.data?.message) {
        // iamport 시스템의 오류 형식에 맞다면 해당 방식으로 출력
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        // 그 외의 일반적인 오류들을 출력
        throw error;
      }
    }
  }

  // DB에 중복된 기록인지 체크
  async checkDuplicate({ impUid }) {
    const result = await this.paymentRepository.findOne({ impUid });
    if (result)
      throw new ConflictException(`이미 결제된 아이디입니다. [${impUid}]`);
  }

  //----------------

  // 구독권 내역 추가하기
  async create({ impUid, amount, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      let type;
      let period;
      if (amount === 20000) {
        type = PAYMENT_STATUS_ENUM.DAY90;
        period = 90;
      } else if (amount === 7000) {
        type = PAYMENT_STATUS_ENUM.DAY30;
        period = 30;
      } else if (amount === 2000) {
        type = PAYMENT_STATUS_ENUM.DAY7;
        period = 7;
      }

      const today = new Date(getToday());
      const end = new Date(getToday(period));

      // 결제 내역에 기록
      const paymentHistory = this.paymentRepository.create({
        impUid,
        paymentDate: today,
        paymentAmount: amount,
        subType: type,
        user: currentUser,
      });

      //회원 정보에 기록
      const paymentData = this.joinRepository.create({
        subStart: today,
        subEnd: end,
        subType: type,
        id: currentUser,
      });

      await queryRunner.manager.save(paymentData);
      await queryRunner.manager.save(paymentHistory);
      await queryRunner.commitTransaction();

      // console.log('🎉🎉🎉 ↓↓↓ DB 저장 완료 ↓↓↓ 🎉🎉🎉');
      // console.log(paymentHistory);

      return paymentHistory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 구독권 내역 만료시키기
  async update({ userId }) {
    console.log(userId);
    await this.joinRepository.save({
      id: userId,
      //id: currentUser,
      subStart: null,
      subEnd: null,
      subType: null,
    });

    return `구독권 만료처리 ${userId}`;
  }
}
