import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { GraphQLJSONObject } from 'graphql-type-json';
import { SubCommentService } from './subcomment.service';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class SubCommentResolver {
  constructor(
    private readonly subCommentService: SubCommentService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateSubComment(
    @Args('subCommentId') subCommentId: string,
    @Args('content') contents: string,
  ) {
    const result = await this.subCommentService.update({
      subCommentId,
      contents,
    });

    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteSubComment(
    @Args('subCommentId') subCommentId: string, //
  ) {
    const result = await this.subCommentService.delete({
      subCommentId,
    });

    return result;
  }
}
