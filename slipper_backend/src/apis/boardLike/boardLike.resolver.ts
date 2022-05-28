import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Board } from '../Board/board.entity';
import { BoardLikeService } from './boardLike.service';
import { BoardLike } from './entities/boardLike.entity';

@Resolver()
export class BoardLikeResolver {
  constructor(
    private readonly boardLikeService: BoardLikeService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async clickLike(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.boardLikeService.like({ boardId, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [BoardLike])
  async fetchLikeBoards(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.boardLikeService.fetchLikeBoards({ currentUser });
  }

  // @Query(() => String)
  // async fetchLikeBoardsCount(@Args('boardId') boardId: string) {
  //   const result = await this.boardLikeService.fetchLikeBoardsLength({
  //     boardId,
  //   });
  //   console.log(result);
  //   return result;
  // }
}
