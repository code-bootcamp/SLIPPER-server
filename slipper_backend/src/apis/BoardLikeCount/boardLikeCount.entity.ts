import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/Board/board.entity';
import { Join } from 'src/apis/join/entities/join.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class BoardLikeCount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Board, (board) => board.likeCount, {
    onDelete: 'CASCADE',
  })
  @Field(() => Board, { nullable: true })
  board: Board;

  @ManyToOne(() => Join, (join) => join.likeList, { onDelete: 'CASCADE' })
  join: Join;
}
