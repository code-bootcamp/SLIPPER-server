import { UseGuards } from '@nestjs/common';
import { Args, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { RolesGuard } from 'src/commons/auth/gql-role.guard';
import { Roles } from 'src/commons/auth/gql-role.param';
import { BoardService } from '../Board/board.service';
import { BusinessUserService } from '../businessBoard/businessBoard.service';
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
  async deleteAdminUserBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardService.findOne({ boardId });
  }
  //@Roles(Role.ADMIN)
  //@UseGuards(GqlAuthAccessGuard, RolesGuard)
  async deleteAdiminBusinessBoard(
    @Args('businessBoardId') businessBoardId: string,
  ) {
    return this.businessUser.delete({ businessBoardId });
  }

  //@Roles(Role.ADMIN)
  //@UseGuards(GqlAuthAccessGuard, RolesGuard)
  //   async deleteAdminUserComment(
  //     @Args('commentId') commentId: string, //
  //   ) {
  //     return this.commentService.delete({ commentId });
  //   }

  //@Roles(Role.ADMIN)
  //@UseGuards(GqlAuthAccessGuard, RolesGuard)
  //   async deleteAdminUserSubComment(@Args('subCommentId') SubCommentId: string) {
  //     return this.subCommentService.delete({ sunCommentId });
  //   }
}
