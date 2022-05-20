import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  USER = 'USER',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN',
}

registerEnumType(Role, { name: 'Role' });
@Entity()
@ObjectType()
export class Join {
  @PrimaryGeneratedColumn('uuid')
  // @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  // @Field(() => String) 일단 해싱전이니까 그냥 두고 해봅시당!!!
  pw: string;

  @Column()
  @Field(() => String)
  nickname: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  introduce: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  businessImageUrl: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @Field(() => Role)
  role: Role;
}
