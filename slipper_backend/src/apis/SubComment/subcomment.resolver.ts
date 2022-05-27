import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { GraphQLJSONObject } from 'graphql-type-json';
import { SubCommentService } from './subcomment.service';

@Resolver()
export class SubCommentResolver {
  constructor(
    private readonly subCommentService: SubCommentService, //
  ) {}

  @Mutation(() => GraphQLJSONObject)
  async createSubComment(
    @Args('commentId') commentId: string,
    @Args('content') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.subCommentService.create({
      commentId,
      contents,
      currentUser: currentUser.id,
    });

    return result;
  }

  @Mutation(() => String)
  async updateSubComment(
    @Args('subCommentId') subCommentId: string,
    @Args('content') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.subCommentService.update({
      subCommentId,
      contents,
    });

    return result;
  }

  @Mutation(() => String)
  async deleteSubComment(
    @Args('subCommentId') subCommentId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.subCommentService.delete({
      subCommentId,
    });

    return result;
  }
}
