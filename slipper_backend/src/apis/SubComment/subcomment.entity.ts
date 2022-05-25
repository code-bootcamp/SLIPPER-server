import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../Comment/comment.entity';

@Entity()
@ObjectType()
export class SubComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  nickname: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => Date)
  createdAt: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageUrl: string;

  @ManyToOne(() => Comment, (comment) => comment.subComment, {
    cascade: true,
  })
  @Field(() => Comment)
  comment: Comment;
}
