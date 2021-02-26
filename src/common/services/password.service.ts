import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly salt = 10;

  hash (password: string) {
    if (!password) {
      throw new BadRequestException('Password not found');
    }
    return bcrypt.hashSync(password, this.salt);
  }

  compare (password: string, oldPassword: string) {
    if (!password || !oldPassword) {
      throw new BadRequestException('Password and compared password not found');
    }

    return bcrypt.compareSync(password, oldPassword);
  }
}
