import { UseGuards } from '@nestjs/common';
import { Args, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { RolesGuard } from 'src/commons/auth/gql-role.guard';
import { Roles } from 'src/commons/auth/gql-role.param';
import { BoardService } from '../Board/board.service';
import { Role } from '../join/entities/join.entity';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}

  //@Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard)
  //@UseGuards(GqlAuthAccessGuard, RolesGuard)
  async deleteAdminUserBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardService.findOne({ boardId });
  }
}
