import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String) //나중에 삭제하고 로그인시 CurrentUser 에서 검색해오는 방법으로 교체
  nickname: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String, { nullable: true })
  thumbnail: string;

  @Field(() => Int)
  score: number;

  @Field(() => String, { nullable: true })
  startDate: string;

  @Field(() => String, { nullable: true })
  endDate: string;

  @Field(() => String)
  lat: string;

  @Field(() => String)
  lng: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  place: string;

  // @Field(() => Int, { nullable: true })
  // likeCount: number;

  // @Field(() => [String], { nullable: true })
  // images: string;
  @Field(() => [String], { nullable: true })
  images: string;
}
