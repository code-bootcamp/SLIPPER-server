import axios from 'axios';
import {
  ConflictException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Join } from '../join/entities/join.entity';
import { getToday } from 'src/commons/libraries/utils';
import { Comment } from '../Comment/comment.entity';
import { SubComment } from './subcomment.entity';

@Injectable()
export class SubCommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(SubComment)
    private readonly subCommentRepository: Repository<SubComment>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async create({ commentId, contents, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser }, //
    });

    const result = await this.subCommentRepository.save({
      nickname: user.nickname,
      imageUrl: user.imageUrl,
      contents: contents,
      createdAt: new Date(getToday()),
      comment: commentId,
    });

    console.log(result);
    return result;
  }

  async update({ subCommentId, contents, currentUser }) {
    const oldSubComment = await this.subCommentRepository.findOne({
      where: { id: subCommentId }, //
    });

    console.log(oldSubComment);

    const result = await this.subCommentRepository.save({
      ...oldSubComment,
      contents,
    });

    console.log(result);

    return result;
  }

  async delete({ commentId, currentUser }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId }, //
      relations: ['subComment'],
    });

    console.log(result);

    return result;
  }
}
