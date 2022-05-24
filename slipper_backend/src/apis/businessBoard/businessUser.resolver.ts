// import { UseGuards } from '@nestjs/common';
// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
// import { RolesGuard } from 'src/commons/auth/gql-role.guard';
// import { Roles } from 'src/commons/auth/gql-role.param';
// import { CurrentUser } from 'src/commons/auth/gql-user.param';
// import { Board } from '../Board/board.entity';
// import { BoardService } from '../Board/board.service';
// import { UpdateBoardInput } from '../Board/dto/update_board.input';
// import { Role } from '../join/entities/join.entity';
// import { BusinessUserService } from './businessUser.service';
// import { CreateBusinessBoardInput } from './dto/create.businessBoard.input';

// @Resolver()
// export class BusinessUserResolver {
//   constructor(
//     private readonly businessUserService: BusinessUserService, //
//     private readonly boardService: BoardService,
//   ) {}

//   //@Roles(Role.BUSINESS)
//   //@UseGuards(GqlAuthAccessGuard, RolesGuard)
//   @UseGuards(GqlAuthAccessGuard)
//   @Mutation(() => Board)
//   async createBusinessBoard(
//     @Args('createBusinessBoardInput')
//     createBusinessBoardInput: CreateBusinessBoardInput,
//     @CurrentUser() currentUser: any, //성환 추가
//   ) {
//     console.log(createBusinessBoardInput);
//     return this.businessUserService.create({
//       createBusinessBoardInput,
//       email: currentUser.email, //성환 추가
//     });
//   }

//   // @Roles(Role.BUSINESS)
//   // @UseGuards(GqlAuthAccessGuard, RolesGuard)
//   @UseGuards(GqlAuthAccessGuard)
//   @Mutation(() => Board)
//   async updateBusinessBoard(
//     @Args('boardId') boardId: string,
//     @Args('updateBoardInput') updateBoardInput: UpdateBoardInput, //
//   ) {
//     return this.boardService.update({ boardId, updateBoardInput });
//   }

//   // @Roles(Role.BUSINESS)
//   // @UseGuards(GqlAuthAccessGuard, RolesGuard)
//   @UseGuards(GqlAuthAccessGuard)
//   @Mutation(() => Boolean)
//   async deleteBusinessBoard(
//     @Args('boardId') boardId: string, //
//   ) {
//     return this.boardService.delete({ boardId });
//   }

//   @Query(() => Board)
//   fetchBusinessBoard(
//     @Args('boardId') boardId: string, //
//   ) {
//     return this.boardService.findOne({ boardId });
//   }
// }
