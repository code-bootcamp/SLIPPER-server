import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
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

  //무한 스크롤
  @Query(() => [Board])
  fetchBoardsPage(
    @Args('page') page: number, //
    @Args('category') category: string, //
    @Args('search') search: string, //
  ) {
    return this.boardService.loadPage({ page, category, search });
  }
  // fetchBoards() {
  //   return this.boardService.findAll();
  // }

  //--------  Mutation  --------
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
  ) {
    return this.boardService.create({ createBoardInput });
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
