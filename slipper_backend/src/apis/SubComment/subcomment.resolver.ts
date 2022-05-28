import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { GraphQLJSONObject } from 'graphql-type-json';
import { SubCommentService } from './subcomment.service';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SubComment } from './subcomment.entity';

@Resolver()
export class SubCommentResolver {
  constructor(
    private readonly subCommentService: SubCommentService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => SubComment)
  async fetchSubComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('commentId') commentId: string,
  ) {
    const result = await this.subCommentService.find({
      commentId,
      currentUser: currentUser.id,
    });

    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => GraphQLJSONObject)
  async createSubComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('commentId') commentId: string,
    @Args('content') contents: string,
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
    @CurrentUser() currentUser: ICurrentUser,
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
    @CurrentUser() currentUser: ICurrentUser,
    @Args('subCommentId') subCommentId: string, //
  ) {
    const result = await this.subCommentService.delete({
      subCommentId,
    });

    return result;
  }
}
