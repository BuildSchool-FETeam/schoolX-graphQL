import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import * as _ from 'lodash'
import { EnvVariable } from 'src/common/interfaces/EnvVariable.interface'
import { BaseService } from 'src/common/services/base.service'
import { PasswordService } from 'src/common/services/password.service'
import { TokenService } from 'src/common/services/token.service'
import { MailjetService } from 'src/Email/services/mailjet.service'
import { ClientUserSignupInput, ClientUserSigninInput } from 'src/graphql'
import { PermissionService } from 'src/permission/services/permission.service'
import { FindOneOptions, Repository } from 'typeorm'
import { ClientUser } from '../entities/ClientUser.entity'
import { AchievementService } from './achievement.service'

@Injectable()
export class ClientAuthService extends BaseService<ClientUser> {
  private SENDER: string

  constructor(
    @InjectRepository(ClientUser)
    private clientRepo: Repository<ClientUser>,
    private passwordService: PasswordService,
    private permissionService: PermissionService,
    private tokenService: TokenService,
    private achiService: AchievementService,
    private emailService: MailjetService,
    private configService: ConfigService<EnvVariable>
  ) {
    super(clientRepo, 'ClientUser')

    this.SENDER = this.configService.get('EMAIL_SENDER')
  }

  async createClientUser(data: ClientUserSignupInput) {
    const { email, password, name } = data
    const existedData = await this.findWithOptions({
      where: { email },
    })

    if (_.size(existedData) > 0) {
      throw new BadRequestException('This email has been taken')
    }
    const newClientUser = this.clientRepo.create({
      email,
      password: this.passwordService.hash(password),
      name,
    })

    const { expiredTime, code } = this.generateActivationCode(1)
    newClientUser.activationCode = code
    newClientUser.activationCodeExpire = expiredTime

    await this.sendEmailWithCode(code, email)
    newClientUser.role = await this.permissionService.getClientUserPermission()
    const clientUserResponse = await this.clientRepo.save(newClientUser)

    await this.achiService.createEmptyAchievement(clientUserResponse)

    return {
      id: clientUserResponse.id,
      email: clientUserResponse.email,
    }
  }

  async loginWithEmailAndPassword(data: ClientUserSigninInput) {
    const { email, password } = data
    const existedClientUser = await this.getClientUserFromEmail(email, [
      'id',
      'password',
      'email',
      'isActive',
    ])

    if (!existedClientUser.isActive) {
      throw new ForbiddenException(
        'This client user is inactive! Please try active it first!'
      )
    }

    const compareResult = this.passwordService.compare(
      password,
      existedClientUser.password
    )

    if (!compareResult) {
      throw new ForbiddenException('Password is invalid')
    }

    return {
      id: existedClientUser.id,
      email: existedClientUser.email,
      token: this.tokenService.createToken({ ...existedClientUser }),
    }
  }

  async activateAccount(email: string, code: string) {
    const clientUser = await this.getClientUserFromEmail(email)

    if (!this.checkActivationCodeValid(clientUser)) {
      throw new BadRequestException('Activation code has been expired')
    }

    if (clientUser.activationCode !== code) {
      throw new BadRequestException('Activation code is invalid!')
    }

    clientUser.isActive = 1
    clientUser.activationCodeExpire = 0
    clientUser.activationCode = ''

    return this.clientRepo.save(clientUser)
  }

  async sendRestorePassword(email: string) {
    const clientUser = await this.getClientUserFromEmail(email)
    const { code, expiredTime } = this.generateActivationCode(1)

    clientUser.activationCode = code
    clientUser.activationCodeExpire = expiredTime
    await this.clientRepo.save(clientUser)

    return this.sendEmailWithCode(code, email, 'Reset password')
  }

  async resetPassword(code: string, password: string, email: string) {
    const clientUser = await this.getClientUserFromEmail(email)

    if (clientUser.activationCode !== code) {
      throw new BadRequestException('Your activation code is invalid!')
    }
    if (!this.checkActivationCodeValid(clientUser)) {
      throw new BadRequestException('Activation code has been expired!')
    }
    clientUser.password = this.passwordService.hash(password)

    return this.clientRepo.save(clientUser)
  }

  private async getClientUserFromEmail(
    email: string,
    select: Array<keyof ClientUser> = []
  ) {
    const findObj: FindOneOptions = {
      where: { email },
      relations: { role: true },
    }

    _.size(select) > 0 && (findObj.select = select)

    const existedUser = await this.clientRepo.findOne(findObj)

    if (!existedUser) {
      throw new ForbiddenException("This email doesn't exist yet")
    }

    return existedUser
  }

  private checkActivationCodeValid(clientUser: ClientUser) {
    const now = Date.now()

    return clientUser.activationCodeExpire > now
  }

  private async sendEmailWithCode(
    code: string,
    email: string,
    emailSubject?: string
  ) {
    await this.emailService.sendMailWithCode({
      messageConfig: {
        from: this.SENDER,
        to: email,
        subject: emailSubject || 'Activation Code',
      },
      templateName: 'TEMP_RESET_PASSWORD',
      code,
    })
  }
}
