import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { cacheConstant } from '../constants/cache.contant'
import { EnvVariable } from '../interfaces/EnvVariable.interface'
import { CacheService } from './cache.service'

@Injectable()
export class TokenService {
  private readonly privateKey: string

  private readonly expirationTime = '8h'

  constructor(
    private configService: ConfigService<EnvVariable>,
    private cacheService: CacheService
  ) {
    this.privateKey = this.configService.get('JWT_SECRET')
  }

  createToken(data: AdminUser | ClientUser) {
    const token = jwt.sign(data, this.privateKey, {
      expiresIn: this.expirationTime,
    })

    return token
  }

  verifyAndDecodeToken(token: string) {
    try {
      const decodedData = jwt.verify(token, this.privateKey) as
        | AdminUser
        | ClientUser

      return decodedData
    } catch (err) {
      throw new Error(err)
    }
  }

  async getAdminUserByToken<T = AdminUser>(token: string) {
    const adminUser = (await this.cacheService.getValue(
      `${cacheConstant.USER}-${token}`
    )) as T

    if (adminUser) {
      return adminUser
    }

    throw new ForbiddenException('Forbidden resource')
  }
}
