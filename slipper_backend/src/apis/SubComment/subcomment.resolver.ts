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
      currentUser: '51129fc3-5826-4cc6-853f-329f5a679f63',
      //currentUser: currentUser.id,
    });

    return result;
  }

  @Mutation(() => GraphQLJSONObject)
  async updateSubComment(
    @Args('subCommentId') subCommentId: string,
    @Args('content') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.subCommentService.update({
      subCommentId,
      contents,
      currentUser: '51129fc3-5826-4cc6-853f-329f5a679f63',
      //currentUser: currentUser.id,
    });

    return result;
  }

  //   @Mutation(() => GraphQLJSONObject)
  //   async deleteSubComment(
  //     @Args('commentId') commentId: string,
  //     @CurrentUser() currentUser: ICurrentUser,
  //   ) {
  //     const result = await this.subCommentService.delete({
  //       commentId,
  //       currentUser: '51129fc3-5826-4cc6-853f-329f5a679f63',
  //       //currentUser: currentUser.id,
  //     });

  //     return result;
  //   }
}
