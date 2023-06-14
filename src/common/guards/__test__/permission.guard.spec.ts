/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Test } from '@nestjs/testing'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createClientUserEntityMock,
  createRoleEntityMock,
} from 'src/common/mock/mockEntity'
import { requestMock } from 'src/common/mock/requestObjectMock'
import { CacheService } from 'src/common/services/cache.service'
import { TokenService } from 'src/common/services/token.service'
import { Role } from 'src/permission/entities/Role.entity'
import { PermissionService } from 'src/permission/services/permission.service'
import { PermissionGuard } from '../permission.guard'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import { ConfigService } from '@nestjs/config'

const tokenService = {
  verifyAndDecodeToken(): any {
    return {}
  },
}
const permissionService = {
  async getPermissionByRole() {
    return Promise.resolve({})
  },
}

const cacheService = {
  setValue() {
    return
  },
}

const reflector = {
  getAllAndOverride() {
    return {}
  },
}

const configService = {
  get() {
    return 'e2e'
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
        ConfigService,
      ],
    })

    module.overrideProvider(TokenService).useValue(tokenService)
    module.overrideProvider(PermissionService).useValue(permissionService)
    module.overrideProvider(CacheService).useValue(cacheService)
    module.overrideProvider(Reflector).useValue(reflector)
    module.overrideProvider(ConfigService).useValue(configService)

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
        getContext() {
          return requestMock
        },

        getType() {
          return
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
            parentType: null,
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

    it('If must verify, should throw error if account not verify', async () => {
      const clientUser = createClientUserEntityMock({
        isActive: 0,
        role: createRoleEntityMock({ name: 'leesin' }),
      })
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true)

      jest
        .spyOn(tokenService, 'verifyAndDecodeToken')
        .mockReturnValue(clientUser)

      await assertThrowError(
        permissionGuard.canActivate.bind(permissionGuard, contextMock),
        new ForbiddenException(
          'This client user is inactive! Please try active it first!'
        )
      )
    })

    it('should throw an Exception if user permission is invalid', async () => {
      const clientUser = createClientUserEntityMock({
        role: null,
      })

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue({})

      jest
        .spyOn(tokenService, 'verifyAndDecodeToken')
        .mockReturnValue(clientUser)

      jest
        .spyOn(permissionService, 'getPermissionByRole')
        .mockResolvedValue(null)

      await assertThrowError(
        permissionGuard.canActivate.bind(permissionGuard, contextMock),
        new NotFoundException(
          'Cannot found proper permission, try another one!'
        )
      )
    })
  })

  describe('canActivate should validate truthy of required Permission ', () => {
    const executionContextMock = {
      getHandler() {
        return null
      },
      getInfo() {
        return {
          parentType: { name: 'query' },
        }
      },
      getContext() {
        return requestMock
      },
    } as any

    beforeEach(() => {
      const clientUser = createClientUserEntityMock({
        role: createRoleEntityMock({ name: 'leesin' }),
      })
      GqlExecutionContext.create = jest.fn(() => executionContextMock)
      jest
        .spyOn(tokenService, 'verifyAndDecodeToken')
        .mockReturnValue(clientUser)
    })

    it('should return TRUE with Course', async () => {
      const userPermission = {
        course: 'C:*|R:+|U:+|D:x',
        user: 'C:*|U:+|D:+|R:x',
        role: new Role(),
      }

      const requiredPermission: PermissionRequire = {
        course: ['C:*', 'R:*', 'U:x', 'D:x'],
      }

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermission)

      jest
        .spyOn(permissionService, 'getPermissionByRole')
        .mockResolvedValue(userPermission)

      const result = await permissionGuard.canActivate(executionContextMock)

      expect(result).toBe(true)
    })

    it('should return TRUE with blog and user', async () => {
      const userPermission = {
        user: 'C:+|R:+|U:x|D:x',
        blog: 'C:*|R:x|U:+|D:+',
        role: new Role(),
      }

      const requiredPermission = {
        blog: ['C:*', 'R:*', 'U:x', 'D:x'],
        user: ['C:*', 'R:x', 'U:x', 'D:x'],
      }

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermission)

      jest
        .spyOn(permissionService, 'getPermissionByRole')
        .mockResolvedValue(userPermission)

      const result = await permissionGuard.canActivate(executionContextMock)

      expect(result).toBe(false)
    })

    it('should be FALSE if missing U permission', async () => {
      const userPermission = {
        user: 'C:+|R:+|U:x|D:x', // would failed
        blog: 'C:*|R:x|U:+|D:+',
        role: new Role(),
      }

      const requiredPermission = {
        blog: ['C:*', 'R:*', 'U:x', 'D:*'],
        user: ['C:*', 'R:x', 'U:x', 'D:x'],
      }

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermission)

      jest
        .spyOn(permissionService, 'getPermissionByRole')
        .mockResolvedValue(userPermission)

      const result = await permissionGuard.canActivate(executionContextMock)

      expect(result).toBe(false)
    })

    it('should be false if user permission is blank', async () => {
      const userPermission = {
        course: '',
      }

      const requiredPermission = {
        course: ['R'],
      }

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermission)

      jest
        .spyOn(permissionService, 'getPermissionByRole')
        .mockResolvedValue(userPermission)

      const result = await permissionGuard.canActivate(executionContextMock)

      expect(result).toBe(false)
    })

    it('should be TRUE if required permission is blank', async () => {
      const userPermission = {
        course: '',
        user: 'R:*|C:+',
      }

      const requiredPermission = {
        course: [],
        user: ['C:+'],
      }

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermission)

      jest
        .spyOn(permissionService, 'getPermissionByRole')
        .mockResolvedValue(userPermission)

      const result = await permissionGuard.canActivate(executionContextMock)

      expect(result).toBe(true)
    })
  })
})
