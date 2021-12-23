import { CacheService } from 'src/common/services/cache.service'
import { PasswordService } from 'src/common/services/password.service'
import { TokenService } from 'src/common/services/token.service'
import { PermissionService } from 'src/permission/services/permission.service'
import { RoleService } from 'src/permission/services/role.service'
import { Repository } from 'typeorm'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MockType, repositoryMockFactory } from 'src/common/mock/repositoryMock'

describe('AdminUserService', () => {
  let permissionService: PermissionService
  let roleService: RoleService
  let userRepo: MockType<Repository<AdminUser>>
  let adminUserService: AdminUserService
  let passwordService: PasswordService
  let tokenService: TokenService
  let cachedService: CacheService

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        AdminUserService,
        {
          provide: getRepositoryToken(AdminUser),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    adminUserService = testModule.get<AdminUserService>(AdminUserService)
    // roleService = testModule.get<RoleService>(RoleService)
    // permissionService = testModule.get<PermissionService>(PermissionService)
    // passwordService = testModule.get<PasswordService>(PasswordService)
    // tokenService = testModule.get<TokenService>(TokenService)
    // cachedService = testModule.get<CacheService>(CacheService)
    userRepo = testModule.get(getRepositoryToken(AdminUser))
  })

  it('should find user by email', () => {
    const user = { name: 'lessin' }
    spyOn(userRepo, 'findOne').and.returnValue(Promise.resolve(user))

    expect(adminUserService.findUserByEmail('some email')).toBe('leesin')
  })
})
