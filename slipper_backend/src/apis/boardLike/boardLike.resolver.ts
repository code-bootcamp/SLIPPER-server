import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { BoardLikeService } from './boardLike.service';

@Resolver()
export class BoardLikeResolver {
  constructor(
    private readonly boardLikeService: BoardLikeService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async clickLike(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    await this.boardLikeService.like({ boardId, currentUser });
  }
}
