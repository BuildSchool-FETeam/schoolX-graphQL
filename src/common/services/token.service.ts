import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AdminUser } from 'src/AdminUser/AdminUser.entity';
import { cacheConstant } from '../constants/cache.contant';
import { EnvVariable } from '../interfaces/EnvVariable.interface';
import { CacheService } from './cache.service';

@Injectable()
export class TokenService {
  private readonly privateKey: string;
  private readonly expirationTime = '8h';

  constructor(
    private configService: ConfigService<EnvVariable>,
    private cacheService: CacheService,
  ) {
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

  async getAdminUserByToken(token: string) {
    const adminUser = (await this.cacheService.getValue(
      cacheConstant.ADMIN_USER + '-' + token,
    )) as AdminUser;

    if (adminUser) {
      return adminUser;
    }

    throw new ForbiddenException('Forbidden resource');
  }
}
