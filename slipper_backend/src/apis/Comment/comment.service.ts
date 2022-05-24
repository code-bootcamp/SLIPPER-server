// import axios from 'axios';
// import {
//   ConflictException,
//   HttpException,
//   Injectable,
//   UnprocessableEntityException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Connection, Repository } from 'typeorm';
// import { Join } from '../join/entities/join.entity';
// import { Payment, PAYMENT_STATUS_ENUM } from './payment.entity';
// import { getToday } from 'src/commons/libraries/utils';

// @Injectable()
// export class PaymentService {
//   constructor(
//     @InjectRepository(Payment)
//     private readonly paymentRepository: Repository<Payment>,

//     @InjectRepository(Join)
//     private readonly joinRepository: Repository<Join>,

//     private readonly connection: Connection,
//   ) {}

//   async getToken() {
//     try {
//       const result = await axios.post('https://api.iamport.kr/users/getToken', {
//         imp_key: process.env.IAMPORT_API_KEY,
//         imp_secret: process.env.IAMPORT_SECRET,
//       });
//       console.log(
//         `[success] 토큰 받기 성공!! ${result.data.response.access_token}`,
//       );

//       return result.data.response.access_token;
//     } catch (error) {
//       console.log('🚨🚨  getToken 오류 발생  🚨🚨');
//       throw new HttpException(
//         error.response.data.message,
//         error.response.status,
//       );
//     }
//   }
// }
