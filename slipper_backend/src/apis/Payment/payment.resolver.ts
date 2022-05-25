import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService, //
  ) {}

  // 구독권 내역 추가하기
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string,
    @Args('amount') amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    // 결제 정보 체크
    // const token = await this.paymentService.getToken();
    // await this.paymentService.checkPaid({ impUid, token, amount });

    // DB에 중복된 기록인지 체크
    // await this.paymentService.checkDuplicate({ impUid });

    console.log(impUid);
    console.log(amount);
    console.log(currentUser);

    //DB에 저장
    return await this.paymentService.create({
      impUid,
      amount,
      currentUser: currentUser.id,
      //currentUser: '6a712267-e15e-4c4d-ba16-164aa41a3aa4',
    });
  }

  // 구독권 내역 만료시키기
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async updatePayment(
    @Args('userId') userId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.paymentService.update({
      userId,
      currentUser: currentUser.id,
      //currentUser: '6a712267-e15e-4c4d-ba16-164aa41a3aa4',
    });

    return result;
  }
}
