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
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Join)
    private readonly joinRepository: Repository<Join>,
  ) {}

  async create({ boardId, contents, currentUser }) {
    const user = await this.joinRepository.findOne({
      where: { id: currentUser }, //
    });

    const result = await this.commentRepository.save({
      nickname: user.nickname,
      imageUrl: user.imageUrl,
      contents: contents,
      createdAt: new Date(getToday()),
      board: boardId,
    });

    console.log(result);
    return result;
  }

  async update({ commentId, contents, currentUser }) {
    const oldComment = await this.commentRepository.findOne({
      where: { id: commentId }, //
    });

    const result = await this.commentRepository.save({
      ...oldComment,
      contents,
    });

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
