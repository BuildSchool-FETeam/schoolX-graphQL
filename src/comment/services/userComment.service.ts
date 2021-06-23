import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { UserComment } from '../entities/UserComment.entity';

@Injectable()
export class UserCommentService extends BaseService<UserComment> {
  constructor(
    @InjectRepository(UserComment)
    private commentRepo: Repository<UserComment>,
  ) {
    super(commentRepo, 'Comment');
  }
}
