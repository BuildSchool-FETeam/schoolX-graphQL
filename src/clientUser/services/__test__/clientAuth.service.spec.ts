import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { createClientUserEntityMock } from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { PasswordService } from 'src/common/services/password.service'
import { TokenService } from 'src/common/services/token.service'
import { MailjetService } from 'src/Email/services/mailjet.service'
import { PermissionService } from 'src/permission/services/permission.service'
import { Repository } from 'typeorm'
import { AchievementService } from '../achievement.service'
import { ClientAuthService } from '../clientAuth.service'
import { ClientUserSignupInput, TypeUser } from 'src/graphql'

const passwordServiceMock = {
  hash() {
    return ''
  },
  compare() {
    return false
  },
}
const permissionServiceMock = {
  async getClientUserPermission() {
    return Promise.resolve({})
  },
}
const tokenServiceMock = {
  createToken() {
    return 'token'
  },
}
const achievementServiceMock = {
  async createEmptyAchievement() {
    return Promise.resolve({})
  },
}
const mailjetServiceMock = {
  async sendMailWithCode() {
    return Promise.resolve({})
  },
}
const configServiceMock = {
  get() {
    return ''
  },
}

describe('ClientAuthService', () => {
  let clientRepo: Repository<ClientUser>
  let clientAuthService: ClientAuthService

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        ClientAuthService,
        PasswordService,
        PermissionService,
        TokenService,
        AchievementService,
        MailjetService,
        ConfigService,
        {
          provide: getRepositoryToken(ClientUser),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule
      .overrideProvider(PasswordService)
      .useValue(passwordServiceMock)
    setupTestModule
      .overrideProvider(PermissionService)
      .useValue(permissionServiceMock)
    setupTestModule.overrideProvider(TokenService).useValue(tokenServiceMock)
    setupTestModule
      .overrideProvider(AchievementService)
      .useValue(achievementServiceMock)
    setupTestModule
      .overrideProvider(MailjetService)
      .useValue(mailjetServiceMock)
    setupTestModule.overrideProvider(ConfigService).useValue(configServiceMock)

    const compliedModule = await setupTestModule.compile()

    clientRepo = compliedModule.get(getRepositoryToken(ClientUser))
    clientAuthService = compliedModule.get(ClientAuthService)
  })

  describe('createClientUser', () => {
    const data: ClientUserSignupInput = {
      email: 'email',
      password: 'password',
      name: 'name',
      type: TypeUser.LEARNER,
    }

    it('It should throw Exception if email is used', async () => {
      jest
        .spyOn(clientAuthService, 'findWithOptions')
        .mockResolvedValue([createClientUserEntityMock()])

      assertThrowError(
        clientAuthService.createClientUser.bind(clientAuthService, data),
        new BadRequestException('This email has been taken')
      )
    })

    it('It should create new ClientUser', async () => {
      jest.spyOn(clientAuthService, 'findWithOptions').mockResolvedValue([])
      const generateActivationCode = jest
        .spyOn(clientAuthService, 'generateActivationCode')
        .mockReturnValue({ expiredTime: 1000, code: 'code' })
      const sendMailWithCode = jest.spyOn(
        mailjetServiceMock,
        'sendMailWithCode'
      )
      const getClientUserPermission = jest
        .spyOn(permissionServiceMock, 'getClientUserPermission')
        .mockResolvedValue({ role: 'role' })
      const hashPassword = jest.spyOn(passwordServiceMock, 'hash')
      const createEmptyService = jest.spyOn(
        achievementServiceMock,
        'createEmptyAchievement'
      )

      const createToken = jest.spyOn(tokenServiceMock, 'createToken')

      jest
        .spyOn(clientRepo, 'save')
        .mockImplementation(async (data) =>
          createClientUserEntityMock({ ...data, id: '1' } as ClientUser)
        )

      const result = await clientAuthService.createClientUser(data)

      expect(result).toEqual({ id: '1', email: 'email', token: 'token' })
      expect(createToken).toHaveBeenCalled()
      expect(generateActivationCode).toHaveBeenCalled()
      expect(sendMailWithCode).toHaveBeenCalled()
      expect(getClientUserPermission).toHaveBeenCalled()
      expect(createEmptyService).toHaveBeenCalled()
      expect(hashPassword).toHaveBeenCalled()
    })
  })

  describe('loginWithEmailAndPassword', () => {
    const data = { email: 'email', password: 'password' }
    const user = createClientUserEntityMock({ id: '1', ...data })

    it("It should throw new Exception if email doesn't exist", async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(null)

      assertThrowError(
        clientAuthService.loginWithEmailAndPassword.bind(
          clientAuthService,
          data
        ),
        new ForbiddenException("This email doesn't exist yet")
      )
    })

    it('It should throw new Exception if password is invalid', async () => {
      user.isActive = 1
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)
      jest.spyOn(passwordServiceMock, 'compare')

      assertThrowError(
        clientAuthService.loginWithEmailAndPassword.bind(
          clientAuthService,
          data
        ),
        new ForbiddenException('Password is invalid')
      )
    })

    it('It should login', async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)
      jest.spyOn(passwordServiceMock, 'compare').mockReturnValue(true)
      jest.spyOn(tokenServiceMock, 'createToken')

      const result = await clientAuthService.loginWithEmailAndPassword(data)

      expect(result).toEqual({
        id: '1',
        email: 'email',
        token: 'token',
      })
    })
  })

  describe('activateAccount', () => {
    const user = createClientUserEntityMock({ id: '1', activationCode: 'code' })

    it("It should throw new Exception if email doesn't exist", async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(null)

      assertThrowError(
        clientAuthService.activateAccount.bind(
          clientAuthService,
          'email',
          'code'
        ),
        new ForbiddenException("This email doesn't exist yet")
      )
    })

    it('It should throw new Exception if code has been expired', async () => {
      user.activationCodeExpire = 2

      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)

      assertThrowError(
        clientAuthService.activateAccount.bind(
          clientAuthService,
          'email',
          'code'
        ),
        new BadRequestException('Activation code has been expired')
      )
    })

    it('It should throw new Exception if code is invalid', async () => {
      user.activationCodeExpire = Number.MAX_VALUE
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)

      assertThrowError(
        clientAuthService.activateAccount.bind(
          clientAuthService,
          'email',
          'code 1'
        ),
        new BadRequestException('Activation code is invalid!')
      )
    })

    it('It should active account', async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)
      jest
        .spyOn(clientRepo, 'save')
        .mockImplementation(async (data) =>
          createClientUserEntityMock({ ...data } as ClientUser)
        )

      const result = await clientAuthService.activateAccount('email', 'code')

      expect(result).toEqual(
        createClientUserEntityMock({
          id: '1',
          isActive: 1,
          activationCodeExpire: 0,
          activationCode: '',
        })
      )
    })
  })

  describe('sendRestorePassword', () => {
    const user = createClientUserEntityMock({ id: '1' })

    it("It should throw new Exception if email doesn't exist", async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(null)

      assertThrowError(
        clientAuthService.sendRestorePassword.bind(clientAuthService, 'email'),
        new ForbiddenException("This email doesn't exist yet")
      )
    })

    it('It should send mail restore password', async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)
      jest
        .spyOn(clientAuthService, 'generateActivationCode')
        .mockReturnValue({ code: 'code', expiredTime: 10000 })
      const sendMail = jest.spyOn(mailjetServiceMock, 'sendMailWithCode')
      const save = jest.spyOn(clientRepo, 'save')

      await clientAuthService.sendRestorePassword('email')

      expect(sendMail).toHaveBeenCalled()
      expect(save).toHaveBeenCalled()
    })
  })

  describe('sendActivateAccount', () => {
    const user = createClientUserEntityMock({ id: '1' })

    it("It should throw new Exception if email doesn't exist", async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(null)

      assertThrowError(
        clientAuthService.sendActivateAccount.bind(clientAuthService, 'email'),
        new ForbiddenException("This email doesn't exist yet")
      )
    })

    it('It should send mail restore password', async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)
      jest
        .spyOn(clientAuthService, 'generateActivationCode')
        .mockReturnValue({ code: 'code', expiredTime: 10000 })
      const sendMail = jest.spyOn(mailjetServiceMock, 'sendMailWithCode')
      const save = jest.spyOn(clientRepo, 'save')

      await clientAuthService.sendActivateAccount('email')

      expect(sendMail).toHaveBeenCalled()
      expect(save).toHaveBeenCalled()
    })
  })

  describe('resetPassword', () => {
    const user = createClientUserEntityMock({ id: '1', activationCode: 'code' })

    it("It should throw new Exception if email doesn't exist", async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(null)

      assertThrowError(
        clientAuthService.resetPassword.bind(
          clientAuthService,
          'code',
          'password',
          'email'
        ),
        new ForbiddenException("This email doesn't exist yet")
      )
    })

    it('It should throw new Exception if code is invalid', async () => {
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)

      assertThrowError(
        clientAuthService.resetPassword.bind(
          clientAuthService,
          'code 1',
          'password',
          'email'
        ),
        new BadRequestException('Your activation code is invalid!')
      )
    })

    it('It should throw new Exception if code has been expired', async () => {
      user.activationCodeExpire = 2
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)

      assertThrowError(
        clientAuthService.resetPassword.bind(
          clientAuthService,
          'code',
          'password',
          'email'
        ),
        new BadRequestException('Activation code has been expired!')
      )
    })

    it('It should reset password', async () => {
      user.activationCodeExpire = Number.MAX_VALUE
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(user)
      const hash = jest
        .spyOn(passwordServiceMock, 'hash')
        .mockReturnValue('hash')

      const result = await clientAuthService.resetPassword(
        'code',
        'password',
        'email'
      )

      expect(result).toEqual(
        createClientUserEntityMock({
          id: '1',
          activationCode: 'code',
          password: 'hash',
          activationCodeExpire: Number.MAX_VALUE,
        })
      )
      expect(hash).toHaveBeenCalled()
    })
  })
})
