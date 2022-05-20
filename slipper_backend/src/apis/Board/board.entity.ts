import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardImage } from '../BoardImage/boardImage.entity';
import { Join } from '../join/entities/join.entity';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @UpdateDateColumn()
  sortDate: Date;

  @Column() // @UpdateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  updatedAt: Date;

  @ManyToOne(() => Join)
  @Field(() => Join)
  user: Join;

  @Column()
  @Field(() => String)
  nickname: string;

  @Column()
  @Field(() => String)
  category: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  thumbnail: string;

  @Column()
  @Field(() => Int)
  score: number;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  startDate: string;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  endDate: string;

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

  @OneToMany(() => BoardImage, (images) => images.board)
  @Field(() => [BoardImage], { nullable: true })
  images: BoardImage[];
}
