import { PermissionService } from 'src/permission/services/permission.service'
import { Repository } from 'typeorm'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MockType, repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { CommonModule } from 'src/common/Common.module'

describe('AdminUserService', () => {
  let userRepo: MockType<Repository<AdminUser>>
  let adminUserService: AdminUserService

  beforeEach(async () => {
    console.log(`Admin Repo`, getRepositoryToken(AdminUser))
    const testModule = await Test.createTestingModule({
      providers: [
        // PermissionService,
        AdminUserService,
        {
          provide: getRepositoryToken(AdminUser),
          useFactory: repositoryMockFactory,
        },
      ],
      imports: [CommonModule],
    }).compile()

    console.log(`Hello`)

    adminUserService = testModule.get<AdminUserService>(AdminUserService)
    // roleService = testModule.get<RoleService>(RoleService)
    // permissionService = testModule.get<PermissionService>(PermissionService)
    // passwordService = testModule.get<PasswordService>(PasswordService)
    // tokenService = testModule.get<TokenService>(TokenService)
    // cachedService = testModule.get<CacheService>(CacheService)
    userRepo = testModule.get(getRepositoryToken(AdminUser))
  })

  describe('findUserByEmail', () => {
    it('should find user by email', () => {
      const user = { name: 'lessin' }
      spyOn(userRepo, 'findOne').and.returnValue(Promise.resolve(user))

      expect(adminUserService.findUserByEmail('some email')).toBe('leesin')
    })
  })
})
