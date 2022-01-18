/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Test } from '@nestjs/testing'
import { requestMock } from 'src/common/mock/requestObjectMock'
import { CacheService } from 'src/common/services/cache.service'
import { TokenService } from 'src/common/services/token.service'
import { PermissionService } from 'src/permission/services/permission.service'
import { PermissionGuard } from '../permission.guard'

const tokenService = {
  verifyAndDecodeToken() {
    return {}
  },
}
const permissionService = {}
const cacheService = {}

const reflector = {
  getAllAndOverride() {
    return {}
  },
}

const contextMock = {} as any

describe('PermissionGuard', () => {
  let permissionGuard: PermissionGuard

  beforeAll(async () => {
    const module = Test.createTestingModule({
      providers: [
        PermissionGuard,
        TokenService,
        PermissionService,
        CacheService,
        Reflector,
      ],
    })

    module.overrideProvider(TokenService).useValue(tokenService)
    module.overrideProvider(PermissionService).useValue(permissionService)
    module.overrideProvider(CacheService).useValue(cacheService)
    module.overrideProvider(Reflector).useValue(reflector)

    const compiledModule = await module.compile()

    permissionGuard = compiledModule.get(PermissionGuard)
  })

  let executionContextMock = {} as any

  describe('canActivate', () => {
    beforeEach(() => {
      executionContextMock = {
        getHandler() {
          return null
        },
        getInfo() {
          return {
            parentType: { name: 'courseQuery' },
          }
        },
      } as any

      GqlExecutionContext.create = jest.fn(() => executionContextMock)
    })

    it('should only check permission for query or mutation the', async () => {
      executionContextMock = {
        getHandler() {
          return null
        },
        getInfo() {
          return {
            parentType: { name: 'someAPI' },
          }
        },
        getContext() {
          return requestMock
        },
      } as any

      GqlExecutionContext.create = jest.fn(() => executionContextMock)

      const result = await permissionGuard.canActivate(contextMock)

      expect(result).toBe(true)
    })

    it('should return true if do not have any require permission', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null)

      const result = await permissionGuard.canActivate(contextMock)

      expect(result).toBe(true)
    })

    it('should return false if user send invalid token', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue({})
      jest
        .spyOn(tokenService, 'verifyAndDecodeToken')
        .mockImplementation(() => {
          throw new Error('test error')
        })

      executionContextMock.getContext = () => {
        return {
          req: {
            headers: {},
          },
        }
      }
      GqlExecutionContext.create = jest.fn(() => executionContextMock)

      const result = await permissionGuard.canActivate(contextMock)

      expect(result).toBe(false)
    })
  })
})
