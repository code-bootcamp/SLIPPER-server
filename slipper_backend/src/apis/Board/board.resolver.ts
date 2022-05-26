import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/create_board.input';
import { UpdateBoardInput } from './dto/update_board.input';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}

  //--------  Query  --------
  @Query(() => Board)
  async fetchBoard(
    @Args('boardId') boardId: string, //
  ) {
    const result = await this.boardService.findOne({ boardId });
    console.log(result);
    return result;
  }

  //검색 결과를 전달해주기 + 무한 스크롤
  @Query(() => [GraphQLJSONObject])
  async fetchBoardsPage(
    //@Args('page', { nullable: true }) page: number, //
    @Args('category', { nullable: true }) category: string, //
    @Args('search', { nullable: true }) search: string, //
  ) {
    const result = await this.boardService.loadPage({ category, search });
    console.log(result);
    return result;
  }

  // @Roles(Role.USER)
  // @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  async fetchUserBoards(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('page', { nullable: true }) page: number,
  ) {
    if (page <= 0) page = 1;
    return await this.boardService.fetchUserBoards({ currentUser, page });
  }
  // fetchBoards() {
  //   return this.boardService.findAll();
  // }

  //--------  Mutation  --------

  /*
  나중에 교체, 추가해야할 코드
  @UseGuards(GqlAuthRefreshGuard)
  @CurrentUser() currentUser: ICurrentUser,
  검색할 때는 currentUser.nickname
  */

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    console.log(currentUser);
    return this.boardService.create({
      createBoardInput,
      email: currentUser.email,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    return await this.boardService.update({
      boardId,
      updateBoardInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardService.delete({ boardId });
  }
}
