import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { BoardLikeCount } from './boardLikeCount.entity';
import { BoardLikeCountService } from './boardLikeCount.service';

@Resolver()
export class BoardLikeCountResolver {
  constructor(
    private readonly boardLikeCountService: BoardLikeCountService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async boardlike(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    const result = await this.boardLikeCountService.likeCountChange({
      boardId,
      currentUser,
    });

    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Int)
  async boardlikeCount(
    @Args('boardId') boardId: string, //
  ) {
    const result = await this.boardLikeCountService.likeCountTotal({
      boardId,
    });

    return result;
  }

  //   @UseGuards(GqlAuthAccessGuard)
  //   @Query(() => [BoardLikeCount])
  //   async fetchLikeBoards(
  //     @CurrentUser() currentUser: ICurrentUser, //
  //   ) {
  //     return await this.boardLikeCountService.fetchLikeBoards({ currentUser });
  //   }

  //   @Query(() => String)
  //   async fetchLikeBoardsCount(@Args('boardId') boardId: string) {
  //     const result = await this.boardLikeCountService.fetchLikeBoardsLength({
  //       boardId,
  //     });
  //     console.log(result);
  //     return result;
  //   }
}
