/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { CacheService } from '../cache.service'
import { TokenService } from '../token.service'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createAdminUserEntityMock,
  createClientUserEntityMock,
} from 'src/common/mock/mockEntity'
import { ForbiddenException } from '@nestjs/common'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { AdminUser } from 'src/adminUser/AdminUser.entity'

const cacheService = {
  getValue: jest.fn(() => ({} as any)),
}
const configService = {
  get() {
    return 'SECRET'
  },
}

const adminUserServiceMock = {
  ...baseServiceMock,
  async findUserById(id: string) {
    return Promise.resolve({ id } as AdminUser)
  },
}

const clientUserServiceMock = {
  ...baseServiceMock,
  async findUserById(id: string) {
    return Promise.resolve({ id } as ClientUser)
  },
}

jest.mock('jsonwebtoken', () => ({
  sign() {
    return 'json token'
  },

  verify(token: string) {
    if (token === 'error token') {
      throw new Error('TestErr')
    }

    return {}
  },
}))

describe('TokenService', () => {
  let tokenService: TokenService
  let adminUserService: AdminUserService
  let clientUserService: ClientUserService

  beforeAll(async () => {
    const module = Test.createTestingModule({
      providers: [
        TokenService,
        ConfigService,
        CacheService,
        AdminUserService,
        ClientUserService,
      ],
    })

    module.overrideProvider(CacheService).useValue(cacheService)
    module.overrideProvider(ConfigService).useValue(configService)
    module.overrideProvider(AdminUserService).useValue(adminUserServiceMock)
    module.overrideProvider(ClientUserService).useValue(clientUserServiceMock)

    const compiledModule = await module.compile()

    tokenService = compiledModule.get(TokenService)
    adminUserService = compiledModule.get(AdminUserService)
    clientUserService = compiledModule.get(ClientUserService)
  })

  describe('createToken', () => {
    it('should create and encode token', () => {
      const token = tokenService.createToken({
        id: '111',
        name: undefined,
        email: undefined,
        password: undefined,
        role: undefined,
      } as any)

      expect(token).toBe('json token')
    })
  })

  describe('verifyAndDecodeToken', () => {
    it('should throw an Error if decode failed', async () => {
      await assertThrowError(
        tokenService.verifyAndDecodeToken.bind(tokenService, 'error token'),
        new Error('Error: TestErr') as any
      )
    })

    it('should return a decoded data', () => {
      const data = tokenService.verifyAndDecodeToken('token')

      expect(data).toEqual({})
    })
  })

  describe('getUserByToken', () => {
    it('should throw Forbiden Error if payload is not exist', async () => {
      cacheService.getValue.mockResolvedValue(null)

      await assertThrowError(
        tokenService.getUserByToken.bind(tokenService, 'token'),
        new ForbiddenException('Forbidden resource')
      )
    })

    it('should throw User doesnt exist', async () => {
      const payload = {
        isAdmin: true,
        id: 'id',
      }
      cacheService.getValue.mockResolvedValue(payload)

      jest.spyOn(adminUserServiceMock, 'findUserById').mockResolvedValue(null)

      await assertThrowError(
        tokenService.getUserByToken.bind(tokenService, 'token'),
        new ForbiddenException('User doesnt exist')
      )
    })

    it('should get adminUser', async () => {
      const payload = {
        isAdmin: true,
        id: 'id',
      }
      const adminUser = createAdminUserEntityMock({ id: payload.id })
      cacheService.getValue.mockResolvedValue(payload)
      jest
        .spyOn(adminUserService, 'findUserById')
        .mockImplementation(async (id: string) =>
          Promise.resolve(createAdminUserEntityMock({ id }))
        )
      const data = await tokenService.getUserByToken('token')

      expect(data).toEqual(adminUser)
    })

    it('should get clientUser', async () => {
      const payload = {
        isAdmin: false,
        id: 'id',
      }
      const clientUser = createClientUserEntityMock({ id: payload.id })
      cacheService.getValue.mockResolvedValue(payload)
      jest
        .spyOn(clientUserService, 'findUserById')
        .mockImplementation(async (id: string) =>
          Promise.resolve(createClientUserEntityMock({ id }))
        )
      const data = await tokenService.getUserByToken('token')

      expect(data).toEqual(clientUser)
    })
  })
})
