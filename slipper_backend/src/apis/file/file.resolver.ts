import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  //게시판 이미지 업로드
  @Mutation(() => [String])
  uploadBoardImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    const type = 'board';
    return this.fileService.upload({ files, type });
  }

  // 프로필 이미지 업로드
  @Mutation(() => [String])
  uploadProfileImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    const type = 'profile';
    return this.fileService.upload({ files, type });
  }
}
