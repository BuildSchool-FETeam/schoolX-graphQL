import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { cacheConstant } from '../constants/cache.contant'
import { EnvVariable } from '../interfaces/EnvVariable.interface'
import { CacheService } from './cache.service'
import { TokenType } from '../constants/user.constant'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'

@Injectable()
export class TokenService {
  private readonly privateKey: string

  private readonly expirationTime = '8h'

  constructor(
    private configService: ConfigService<EnvVariable>,
    private cacheService: CacheService,
    @Inject(forwardRef(() => AdminUserService))
    private adminUserService: AdminUserService,
    @Inject(forwardRef(() => ClientUserService))
    private clientUserService: ClientUserService
  ) {
    this.privateKey = this.configService.get('JWT_SECRET')
  }

  createToken(data: TokenType) {
    const token = jwt.sign(data, this.privateKey, {
      expiresIn: this.expirationTime,
    })

    return token
  }

  verifyAndDecodeToken(token: string) {
    try {
      const decodedData = jwt.verify(token, this.privateKey) as TokenType

      return decodedData
    } catch (err) {
      throw new Error(err)
    }
  }

  async getUserByToken(token: string) {
    const data = (await this.cacheService.getValue(
      `${cacheConstant.USER}-${token}`
    )) as TokenType

    if (!data) {
      throw new ForbiddenException('Forbidden resource')
    }
    let user: AdminUser | ClientUser
    if (data.isAdmin) {
      user = await this.adminUserService.findUserById(data.id)
    } else {
      user = await this.clientUserService.findUserById(data.id)
    }

    if (!user) {
      throw new ForbiddenException('User doesnt exist')
    }

    return user
  }
}
