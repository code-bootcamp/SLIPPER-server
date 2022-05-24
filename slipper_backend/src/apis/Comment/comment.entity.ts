import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Join } from '../join/entities/join.entity';

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Date)
  paymentDate: Date;

  @Column()
  @Field(() => Int)
  paymentAmount: number;

  @Column()
  @Field(() => String)
  impUid: string;
}
