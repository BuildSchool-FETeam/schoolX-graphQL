import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { Repository } from 'typeorm'
import { anyString, instance, mock, when } from 'ts-mockito'
import { RoleService } from 'src/permission/services/role.service'
import { CacheService } from 'src/common/services/cache.service'
import { PasswordService } from 'src/common/services/password.service'
import { TokenService } from 'src/common/services/token.service'
import { PermissionService } from 'src/permission/services/permission.service'

describe('AdminUserVer 2', () => {
  let adminUserService: AdminUserService
  let passwordService: PasswordService
  let roleService: RoleService
  let permissionService: PermissionService
  let tokenService: TokenService
  let cachedService: CacheService
  let userRepo: Repository<AdminUser>

  beforeEach(() => {
    const MockUserRepo: Repository<AdminUser> = mock()
    const MockPasswordService = mock(PasswordService)
    const MockRoleService = mock(RoleService)
    const MockPermissionService = mock(PermissionService)
    const MockTokenService = mock(TokenService)
    const MockCacheService = mock(CacheService)

    userRepo = instance(MockUserRepo)
    passwordService = instance(MockPasswordService)
    roleService = instance(MockRoleService)
    permissionService = instance(MockPermissionService)
    tokenService = instance(MockTokenService)
    cachedService = instance(MockCacheService)

    adminUserService = new AdminUserService(
      userRepo,
      passwordService,
      permissionService,
      roleService,
      tokenService,
      cachedService
    )
  })

  describe('findUserByEmail', () => {
    it('should find a user', () => {
      when(userRepo.findOne(anyString())).thenResolve([
        { name: 'leesin' },
      ] as any)

      expect(adminUserService.findUserByEmail('email')).toEqual({
        name: 'leesin',
      })
    })
  })
})
