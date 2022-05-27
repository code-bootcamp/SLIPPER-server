import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CommentService } from './comment.service';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService, //
  ) {}

  @Mutation(() => GraphQLJSONObject)
  async createComment(
    @Args('boardId') boardId: string,
    @Args('content') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.commentService.create({
      boardId,
      contents,
      currentUser: currentUser.id,
    });

    return result;
  }

  @Mutation(() => String)
  async updateComment(
    @Args('commentId') commentId: string,
    @Args('content') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.commentService.update({
      commentId,
      contents,
    });

    return result;
  }

  @Mutation(() => String)
  async deleteComment(
    @Args('commentId') commentId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.commentService.delete({
      commentId,
    });

    return result;
  }
}
