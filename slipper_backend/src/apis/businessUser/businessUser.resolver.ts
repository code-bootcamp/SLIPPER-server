import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { RolesGuard } from 'src/commons/auth/gql-role.guard';
import { Roles } from 'src/commons/auth/gql-role.param';
import { Board } from '../Board/board.entity';
import { BoardService } from '../Board/board.service';
import { CreateBoardInput } from '../Board/dto/create_board.input';
import { UpdateBoardInput } from '../Board/dto/update_board.input';
import { Role } from '../join/entities/join.entity';

@Resolver()
export class BusinessUserResolver {
  constructor(private readonly boardService: BoardService) {}

  // @Roles(Role.BUSINESS)
  @UseGuards(GqlAuthAccessGuard)
  // , RolesGuard
  @Mutation(() => Board)
  async createBusinessBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ) {
    console.log(createBoardInput);
    return this.boardService.create({ createBoardInput });
  }

  // @Roles(Role.BUSINESS)
  @UseGuards(GqlAuthAccessGuard)
  // , RolesGuard
  @Mutation(() => Board)
  async updateBusinessBoard(
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput, //
  ) {
    return this.boardService.update({ boardId, updateBoardInput });
  }

  @Query(() => Board)
  fetchBusinessBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardService.findOne({ boardId });
  }
}
