// import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
// import { Payment } from './payment.entity';
// import { PaymentService } from './payment.service';

// @Resolver()
// export class PaymentResolver {
//   constructor(
//     private readonly paymentService: PaymentService, //
//   ) {}

//   @Mutation(() => Payment)
//   async createPayment(
//     @Args('impUid') impUid: string,
//     @Args('amount') amount: number,
//     @CurrentUser() currentUser: ICurrentUser,
//   ) {
//     // 결제 정보 체크
//     const token = await this.paymentService.getToken();
//     await this.paymentService.checkPaid({ impUid, token, amount });

//     // DB에 중복된 기록인지 체크
//     await this.paymentService.checkDuplicate({ impUid });

//     // DB에 저장
//     return await this.paymentService.create({
//       impUid,
//       amount,
//       currentUser: currentUser.id,
//       //currentUser: '6a712267-e15e-4c4d-ba16-164aa41a3aa4',
//     });
//   }

//   @Mutation(() => Payment)
//   async deletePayment(
//     @Args('userId') userId: string,
//     @CurrentUser() currentUser: ICurrentUser,
//   ) {
//     const result = await this.paymentService.delete({
//       userId,
//       currentUser: currentUser.id,
//       //currentUser: '6a712267-e15e-4c4d-ba16-164aa41a3aa4',
//     });

//     return result;
//   }
// }
