import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AdminUser } from 'src/AdminUser/AdminUser.entity';

@Injectable()
export class TokenService {
  private readonly privateKey = 'Yasuoganktem20gg';
  private readonly expirationTime = '8h';

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
