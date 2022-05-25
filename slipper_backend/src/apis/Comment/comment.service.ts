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
      contents: contents,
      createdAt: new Date(getToday()),
      imageUrl: user.imageUrl,
      board: boardId,
    });

    console.log(result);

    return result;
  }

  async update({ boardId, currentUser }) {
    const result = await this.commentRepository.findOne({
      where: { id: boardId }, //
      relations: ['images'],
    });

    return result;
  }

  async delete({ boardId, currentUser }) {
    const result = await this.commentRepository.findOne({
      where: { id: boardId }, //
      relations: ['images'],
    });

    return result;
  }
}
