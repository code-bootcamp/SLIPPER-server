import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Resolver()
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService, //
  ) {}

  @Mutation(() => Comment)
  async createComment(
    @Args('boardId') boardId: string,
    @Args('content') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.commentService.create({
      boardId,
      contents,
      currentUser: '43afe5a9-1ec9-4811-85b6-80bbe370586f',
      //currentUser: currentUser.id,
    });

    return result;
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.commentService.update({
      boardId,
      currentUser: '43afe5a9-1ec9-4811-85b6-80bbe370586f',
      //currentUser: currentUser.id,
    });

    return result;
  }

  @Mutation(() => Comment)
  async deleteComment(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.commentService.delete({
      boardId,
      currentUser: '43afe5a9-1ec9-4811-85b6-80bbe370586f',
      //currentUser: currentUser.id,
    });

    return result;
  }
}
