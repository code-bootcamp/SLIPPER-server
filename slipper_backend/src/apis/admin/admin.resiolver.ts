import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { RolesGuard } from 'src/commons/auth/gql-role.guard';
import { Roles } from 'src/commons/auth/gql-role.param';
import { Board } from '../Board/board.entity';
import { BoardService } from '../Board/board.service';
import { BusinessUserService } from '../businessBoard/businessBoard.service';
import { BusinessBoard } from '../businessBoard/entities/businessBoard.entity';
import { Comment } from '../Comment/comment.entity';
import { CommentService } from '../Comment/comment.service';
import { Role } from '../join/entities/join.entity';
import { SubComment } from '../SubComment/subcomment.entity';
import { SubCommentService } from '../SubComment/subcomment.service';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly boardService: BoardService, //
    private readonly commentService: CommentService,
    private readonly subCommentService: SubCommentService,
    private readonly businessUser: BusinessUserService,
  ) {}

  //@Roles(Role.ADMIN)
  //@UseGuards(GqlAuthAccessGuard, RolesGuard)
  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteAdminUserBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardService.delete({ boardId });
  }
  //@Roles(Role.ADMIN)
  //@UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => String)
  async deleteAdiminBusinessBoard(
    @Args('businessBoardId') businessBoardId: string,
  ) {
    return this.businessUser.delete({ businessBoardId });
  }

  //@Roles(Role.ADMIN)
  //@UseGuards(GqlAuthAccessGuard, RolesGuard)
  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteAdminUserComment(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentService.delete({ commentId });
  }

  //@Roles(Role.ADMIN)
  //@UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => String)
  @UseGuards(GqlAuthAccessGuard)
  async deleteAdminUserSubComment(@Args('subCommentId') subCommentId: string) {
    return this.subCommentService.delete({ subCommentId });
  }
}
