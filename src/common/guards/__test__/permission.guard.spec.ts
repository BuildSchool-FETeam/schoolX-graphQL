/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from '@nestjs/common'
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
        getContext() {
          return requestMock
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

    it('should throw an Exception if user permission is invalid', async () => {
      const clientUser = createClientUserEntityMock({
        role: createRoleEntityMock({ name: 'leesin' }),
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
    const executionContextMock = {} as any

    beforeEach(() => {
      const clientUser = createClientUserEntityMock({
        role: createRoleEntityMock({ name: 'leesin' }),
      })

      jest
        .spyOn(tokenService, 'verifyAndDecodeToken')
        .mockReturnValue(clientUser)
    })

    it('should return false if missing C permission', async () => {
      const userPermission = {
        course: 'U|D|R',
        user: 'U|D|R',
        blog: 'U|D|R',
        instructor: 'U|D|R',
        permission: 'U|D|R',
        notification: 'U|D|R',
        role: new Role(),
      }

      const requiredPermission = {
        course: ['C'],
        user: ['C'],
        blog: ['C'],
        instructor: ['C'],
        permission: ['C'],
        notification: ['C'],
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

    it('should return false if missing one of two permissions', async () => {
      const userPermission = {
        course: 'U|D|R',
        user: 'U|D|R',
        blog: 'U|D|R',
        instructor: 'U|D|R',
        permission: 'U|D|R',
        notification: 'U|D|R',
        role: new Role(),
      }

      const requiredPermission = {
        course: ['C', 'U'],
        user: ['U'],
        blog: ['U'],
        instructor: ['U'],
        permission: ['U'],
        notification: ['U'],
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

    it('should be false if missing U permission', async () => {
      const userPermission = {
        user: 'R',
      }

      const requiredPermission = {
        user: ['U'],
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

    it('should be true if required permission is blank', async () => {
      const userPermission = {
        course: '',
        user: 'R|C',
      }

      const requiredPermission = {
        course: [],
        user: ['C'],
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

    it('should be true if user permission match the required one', async () => {
      const userPermission = {
        course: 'C|R',
        user: 'C|R|U',
        blog: 'D|R',
        instructor: 'U|D|C|S',
        permission: 'U|D|C|R',
        notification: 'C|U|D|R|S',
        role: new Role(),
      }

      const requiredPermission = {
        course: ['C'],
        user: ['U'],
        blog: ['D'],
        instructor: ['C', 'U'],
        permission: ['C', 'U', 'D'],
        notification: ['C', 'R', 'U', 'D'],
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
