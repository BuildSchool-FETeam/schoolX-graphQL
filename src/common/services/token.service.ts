import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AdminUser } from 'src/AdminUser/AdminUser.entity';
import { EnvVariable } from '../interfaces/EnvVariable.interface';

@Injectable()
export class TokenService {
  private readonly privateKey: string;
  private readonly expirationTime = '8h';

  constructor(private configService: ConfigService<EnvVariable>) {
    this.privateKey = this.configService.get('JWT_SECRET');
  }

  createToken(data: AdminUser) {
    const token = jwt.sign(data, this.privateKey, {
      expiresIn: this.expirationTime,
    });

    return token;
  }

  verifyAndDecodeToken(token: string) {
    try {
      const decodedData = jwt.verify(token, this.privateKey) as AdminUser;

      return decodedData;
    } catch (err) {
      throw new Error(err);
    }
  }
}
