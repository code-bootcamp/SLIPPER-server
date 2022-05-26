import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Comment } from './comment.entity';
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
      currentUser: '29149b29-5d39-4bbc-8e44-3c8cb6352757',
      //currentUser: currentUser.id,
    });

    return result;
  }

  @Mutation(() => GraphQLJSONObject)
  async updateComment(
    @Args('commentId') commentId: string,
    @Args('content') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.commentService.update({
      commentId,
      contents,
      currentUser: '29149b29-5d39-4bbc-8e44-3c8cb6352757',
      //currentUser: currentUser.id,
    });

    return result;
  }

  @Mutation(() => GraphQLJSONObject)
  async deleteComment(
    @Args('commentId') commentId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.commentService.delete({
      commentId,
      currentUser: '29149b29-5d39-4bbc-8e44-3c8cb6352757',
      //currentUser: currentUser.id,
    });

    return result;
  }
}
