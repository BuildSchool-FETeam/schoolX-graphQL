/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing'
import { CacheService } from 'src/common/services/cache.service'
import { TokenService } from 'src/common/services/token.service'
import { AuthGuard } from '../auth.guard'
import { GqlExecutionContext } from '@nestjs/graphql'
import { requestMock } from 'src/common/mock/requestObjectMock'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { InternalServerErrorException } from '@nestjs/common'
import { createClientUserEntityMock } from 'src/common/mock/mockEntity'

const tokenService = {
  verifyAndDecodeToken() {
    return {}
  },
}
const cacheService = {
  getValue() {
    return true
  },
  async setValue() {
    return Promise.resolve()
  },
}

describe('AuthGuard', () => {
  let authService: AuthGuard

  const contextMock: DynamicObject = {}

  beforeAll(async () => {
    const module = Test.createTestingModule({
      providers: [TokenService, CacheService, AuthGuard],
    })

    module.overrideProvider(TokenService).useValue(tokenService)
    module.overrideProvider(CacheService).useValue(cacheService)

    const compiledModule = await module.compile()

    authService = compiledModule.get(AuthGuard)
  })

  beforeEach(() => {
    GqlExecutionContext.create = jest.fn(() => {
      return {
        getContext() {
          return requestMock
        },
      }
    }) as any
  })

  describe('canActivate', () => {
    it('should stop if server is maintaining', async () => {
      assertThrowError(
        authService.canActivate.bind(authService, contextMock as DynamicObject),
        new InternalServerErrorException(
          'Server is maintaining, please wait 2-5 minutes'
        )
      )
    })

    it('should return false if request have no authorization header', async () => {
      GqlExecutionContext.create = jest.fn(() => {
        return {
          getContext() {
            return {
              req: {
                headers: {
                  nothing: 'hi',
                },
              },
            }
          },
        }
      }) as any

      jest.spyOn(cacheService, 'getValue').mockReturnValue(false)

      const result = await authService.canActivate(contextMock as any)

      expect(result).toBeFalsy()
    })

    it('should return true if it verify a valid user', async () => {
      GqlExecutionContext.create = jest.fn(() => {
        return {
          getContext() {
            return requestMock
          },
        }
      }) as any

      jest.spyOn(cacheService, 'getValue').mockReturnValue(false)
      jest
        .spyOn(tokenService, 'verifyAndDecodeToken')
        .mockReturnValue(createClientUserEntityMock())

      const result = await authService.canActivate(contextMock as any)

      expect(result).toBe(true)
    })

    it('should return false if it cannot verify a valid user', async () => {
      GqlExecutionContext.create = jest.fn(() => {
        return {
          getContext() {
            return requestMock
          },
        }
      }) as any

      jest.spyOn(cacheService, 'getValue').mockReturnValue(false)
      jest
        .spyOn(tokenService, 'verifyAndDecodeToken')
        .mockImplementation(() => {
          throw new Error('test error')
        })

      const result = await authService.canActivate(contextMock as any)

      expect(result).toBe(false)
    })
  })
})
