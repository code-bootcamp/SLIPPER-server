import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Join } from './entities/join.entity';
import { JoinService } from './join.service';
import * as bcrypt from 'bcrypt';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserSaveInput } from './dto/updateUsersave.input';

@Resolver()
export class JoinResolver {
  constructor(
    private readonly joinService: JoinService, //
  ) {}

  @Mutation(() => Join)
  async createUser(
    // @Args('email') email: string,
    // @Args('pw') pw: string,
    // @Args('phone') phone: string,
    // @Args('introduce', { nullable: true }) introduce: string,
    // @Args('nickname') nickname: string,
    // @Args('image', { nullable: true }) image: string,
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    const hashedPw = await bcrypt.hash(createUserInput.pw, 10);
    await this.joinService.checkphone({ phone: createUserInput.phone });
    createUserInput.pw = hashedPw;
    return this.joinService.create({
      // email,
      // hashedPw,
      // phone,
      // introduce,
      // nickname,
      // image,
      createUserInput,
    });
  }

  @Mutation(() => String)
  async getToken(
    @Args('phone') phone: string, //
  ) {
    const token = await this.joinService.getToken(6);
    await this.joinService.redisToken({ phone, token });
    await this.joinService.sendToSMS({ phone, token });
    return '토큰생성 와완료';
  }

  @Mutation(() => String)
  async proofToken(
    @Args('phone') phone: string, //
    @Args('mytoken') mytoken: string,
  ) {
    return await this.joinService.checkToken({ mytoken, phone });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Join)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserSaveInput, //
    @CurrentUser() currentUser: any,
  ) {
    console.log(updateUserInput);
    return await this.joinService.update({
      email: currentUser.email,
      updateUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Join)
  async fetchUser(
    @CurrentUser() currentUser: any, //
  ) {
    return await this.joinService.findOne({ email: currentUser.email });
  }

  @Query(() => [Join])
  async fetchUsers() {
    return this.joinService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean)
  async deleteUser(
    @CurrentUser() currentUser: any, //
  ) {
    return this.joinService.delete({ email: currentUser.email });
  }
}
