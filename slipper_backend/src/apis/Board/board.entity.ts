import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardImage } from '../BoardImage/boardImage.entity';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Field(() => String)
  category: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => Int)
  score: number;

  @Column({ default: null }) //{ default: null }
  @Field(() => String, { nullable: true }) //{ nullable: true } / String
  period: string;

  @Column()
  @Field(() => String)
  lat: string;

  @Column()
  @Field(() => String)
  lng: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  place: string;

  @Column({ default: 0 })
  @Field(() => Int)
  likeCount: number;

  // @Field(() => [String], { nullable: true })
  // images: string;
  @JoinColumn()
  @OneToMany(() => BoardImage, (board) => board.imageUrl)
  @Field(() => [BoardImage], { nullable: true })
  images: BoardImage[];
}
