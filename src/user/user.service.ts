import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/common/services/password.service';
import { Repository } from 'typeorm';
import { User } from './User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private passwordService: PasswordService,
  ) {}

  async createUser(data: Partial<User>) {
    const user = this.userRepo.create({
      ...data,
      password: this.passwordService.hash(data.password),
    });

    return this.userRepo.save(user);
  }

  async findAllUser() {
    return this.userRepo.find();
  }
}
