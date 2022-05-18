import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  nickname: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => Int)
  score: number;

  @Field(() => String, { nullable: true })
  period: string;

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
