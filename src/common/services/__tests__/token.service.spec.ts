/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { CacheService } from '../cache.service'
import { TokenService } from '../token.service'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { createAdminUserEntityMock } from 'src/common/mock/mockEntity'
import { ForbiddenException } from '@nestjs/common'

const cacheService = {
  getValue: jest.fn(() => ({} as any)),
}
const configService = {
  get() {
    return 'SECRET'
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

  beforeAll(async () => {
    const module = Test.createTestingModule({
      providers: [TokenService, ConfigService, CacheService],
    })

    module.overrideProvider(CacheService).useValue(cacheService)
    module.overrideProvider(ConfigService).useValue(configService)

    const compiledModule = await module.compile()

    tokenService = compiledModule.get(TokenService)
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

  describe('getAdminUserByToken', () => {
    it('should get adminUser if it can find one', async () => {
      const adminUser = createAdminUserEntityMock({ id: '1', name: 'zed' })
      cacheService.getValue.mockResolvedValue(adminUser)

      const data = await tokenService.getAdminUserByToken('token')

      expect(data).toEqual(adminUser)
    })

    it('should throw Forbiden Error', async () => {
      cacheService.getValue.mockImplementation(() => {
        throw new ForbiddenException('Forbidden resource')
      })

      await assertThrowError(
        tokenService.getAdminUserByToken.bind(tokenService, 'token'),
        new ForbiddenException('Forbidden resource')
      )
    })
  })
})
