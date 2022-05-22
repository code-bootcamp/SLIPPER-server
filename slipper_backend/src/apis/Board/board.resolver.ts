import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/create_board.input';
import { UpdateBoardInput } from './dto/update_board.input';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}

  //--------  Query  --------
  @Query(() => Board)
  fetchBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardService.findOne({ boardId });
  }

  //검색 결과를 전달해주기 + 무한 스크롤
  @Query(() => [String])
  async fetchBoardsPage(
    @Args('page') page: number, //
    @Args('category') category: string, //
    @Args('search') search: string, //
  ) {
    const result = await this.boardService.loadPage({ page, category, search });
    console.log(result);
    return result;
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

  @UseGuards(GqlAuthAccessGuard) //추가
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
    @CurrentUser() currentUser: any, //추가
  ) {
    return this.boardService.create({
      createBoardInput,
      email: currentUser.email,
    });
  }

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

  @Mutation(() => String)
  deleteBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardService.delete({ boardId });
  }
}
