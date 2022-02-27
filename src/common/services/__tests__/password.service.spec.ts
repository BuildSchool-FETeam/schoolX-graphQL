import { BadRequestException } from '@nestjs/common'
import { assertThrowError } from 'src/common/mock/customAssertion'
import 'src/common/services/__tests__/mocks/BcryptMock.ts'
import { PasswordService } from '../password.service'

describe('PasswordService', () => {
  let service: PasswordService

  beforeAll(() => {
    service = new PasswordService()
  })

  describe('hash', () => {
    it('should throw error if password is undefined', async () => {
      await assertThrowError(
        service.hash.bind(service, undefined),
        new BadRequestException('Password not found')
      )
    })

    it('should hash the password', () => {
      const result = service.hash('password')

      expect(result).toEqual('password_10')
    })
  })

  describe('compare', () => {
    it('should throw error if new password is undefined', async () => {
      await assertThrowError(
        service.compare.bind(service, undefined, 'old'),
        new BadRequestException('Password and compared password not found')
      )
    })

    it('should throw error if old password is undefined', async () => {
      await assertThrowError(
        service.compare.bind(service, 'new', undefined),
        new BadRequestException('Password and compared password not found')
      )
    })

    it('should compare the password', () => {
      const result = service.compare('password', 'password')

      expect(result).toBe(true)
    })
  })
})
