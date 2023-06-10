import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createAdminUserEntityMock,
  createRoleEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { CacheService } from 'src/common/services/cache.service'
import { PasswordService } from 'src/common/services/password.service'
import { TokenService } from 'src/common/services/token.service'
import { AdminUserSetInput } from 'src/graphql'
import { Role } from 'src/permission/entities/Role.entity'
import { PermissionService } from 'src/permission/services/permission.service'
import { RoleService } from 'src/permission/services/role.service'
import { Repository } from 'typeorm'
import { AdminUserService } from '../AdminUser.service'

const passwordServiceMock = {
  hash(str: string) {
    return 'hash_' + str
  },
}

const permissionServiceMock = {
  createAdminPermission() {
    return {}
  },
  async savePermissionSet() {
    return Promise.resolve({})
  },
}

const roleServiceMock = {
  async createAdminRole() {
    const role = new Role()
    role.name = 'role_name'

    return Promise.resolve(role)
  },
  async findRoleByName() {
    return Promise.resolve({})
  },
}

const tokenServiceMock = {
  async getAdminUserByToken() {
    return Promise.resolve(
      createAdminUserEntityMock({ id: '2', name: 'yasuo' })
    )
  },
}
const cacheServiceMock = {
  getValue() {
    return 'value'
  },
}

describe('AdminUserService', () => {
  let adminUserService: AdminUserService
  let adminRepo: Repository<AdminUser>
  let permissionService: PermissionService
  let passwordService: PasswordService

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        AdminUserService,
        PasswordService,
        PermissionService,
        RoleService,
        TokenService,
        {
          provide: getRepositoryToken(AdminUser),
          useFactory: repositoryMockFactory,
        },
        CacheService,
      ],
    })

    setupTestModule
      .overrideProvider(PasswordService)
      .useValue(passwordServiceMock)
    setupTestModule
      .overrideProvider(PermissionService)
      .useValue(permissionServiceMock)
    setupTestModule.overrideProvider(RoleService).useValue(roleServiceMock)
    setupTestModule.overrideProvider(TokenService).useValue(tokenServiceMock)
    setupTestModule.overrideProvider(CacheService).useValue(cacheServiceMock)

    const compiledModule = await setupTestModule.compile()

    adminUserService = compiledModule.get(AdminUserService)
    adminRepo = compiledModule.get(getRepositoryToken(AdminUser))
    permissionService = compiledModule.get(PermissionService)
    passwordService = compiledModule.get(PasswordService)
  })

  let adminSetInput: AdminUserSetInput

  beforeEach(() => {
    adminSetInput = {
      email: 'test@test',
      name: 'leesin',
      role: 'admin',
      password: '12345',
    }
  })

  describe('validationEmail', () => {
    it('It should throw error user is existed', async () => {
      jest
        .spyOn(adminUserService, 'findWithOptions')
        .mockResolvedValue([createAdminUserEntityMock()])

      assertThrowError(
        adminUserService.validationEmail.bind(
          adminUserService,
          'example@gmail.com'
        ),
        new BadRequestException('This email has been taken')
      )
    })

    it('It should return true', async () => {
      jest.spyOn(adminUserService, 'findWithOptions').mockResolvedValue([])

      const result = await adminUserService.validationEmail('example@gmail.com')
      expect(result).toEqual(true)
    })
  })

  describe('findUserByEmail', () => {
    const adminUser: AdminUser = createAdminUserEntityMock()

    it('should find a user by email', async () => {
      jest.spyOn(adminRepo, 'findOne').mockResolvedValue(adminUser)
      const result = await adminUserService.findUserByEmail('test@test.com')

      expect(result).toEqual(adminUser)
    })
  })

  describe('createUserBySignup', () => {
    it('should throw error when exist at least one admin in DB', async function () {
      jest.spyOn(adminRepo, 'count').mockResolvedValue(1)
      const adminUser = createAdminUserEntityMock()

      await assertThrowError(
        adminUserService.createUserBySignup.bind(adminUserService, adminUser),
        new BadRequestException('Only have one admin created by this way')
      )
    })

    it('should create and save an adminUser if there is no admin user in DB', async () => {
      const adminUser = createAdminUserEntityMock()

      jest.spyOn(adminRepo, 'count').mockResolvedValue(0)
      jest
        .spyOn(adminRepo, 'create')
        .mockImplementation((data) => data as AdminUser)
      const spyCreatePerm = jest.spyOn(
        permissionService,
        'createAdminPermission'
      )
      const spyHash = jest.spyOn(passwordService, 'hash')

      const result = await adminUserService.createUserBySignup(adminUser)

      const role = new Role()
      role.name = 'role_name'
      adminUser.role = role
      adminUser.password = `hash_${adminUser.password}`

      expect(result).toEqual(adminUser)
      expect(spyCreatePerm).toHaveBeenCalledTimes(1)
      expect(spyHash).toHaveBeenCalledTimes(1)
    })
  })

  describe('createUser', () => {
    it('should throw NotFound error when cannot find any existed role with role name', async () => {
      jest.spyOn(roleServiceMock, 'findRoleByName').mockResolvedValue(undefined)

      await assertThrowError(
        adminUserService.createUser.bind(
          adminUserService,
          adminSetInput,
          'token'
        ),
        new NotFoundException('This role is not existed')
      )
    })

    it('should throw NotFound error when the email has been registered', async () => {
      jest
        .spyOn(roleServiceMock, 'findRoleByName')
        .mockResolvedValue(new Role())
      jest
        .spyOn(adminRepo, 'find')
        .mockResolvedValue([createAdminUserEntityMock()])

      await assertThrowError(
        adminUserService.createUser.bind(
          adminUserService,
          adminSetInput,
          'token'
        ),
        new NotFoundException('This user email has been taken!')
      )
    })

    it("should throw BadRequest error user don't provide password", async () => {
      jest.spyOn(roleServiceMock, 'findRoleByName').mockResolvedValue({})
      jest.spyOn(adminRepo, 'find').mockResolvedValue([])
      adminSetInput.password = null

      await assertThrowError(
        adminUserService.createUser.bind(
          adminUserService,
          adminSetInput,
          'token'
        ),
        new BadRequestException('Cannot create an adminUser without password')
      )
    })

    it('should create an adminUser', async () => {
      const role = createRoleEntityMock({ name: 'admin' })
      const createdByAdmin = createAdminUserEntityMock({
        id: '2',
        name: 'yasuo',
      })

      jest.spyOn(roleServiceMock, 'findRoleByName').mockResolvedValue(role)
      jest.spyOn(adminRepo, 'find').mockResolvedValue([])
      jest
        .spyOn(tokenServiceMock, 'getAdminUserByToken')
        .mockResolvedValue(createdByAdmin)

      jest
        .spyOn(adminRepo, 'save')
        .mockImplementation(async (data) =>
          createAdminUserEntityMock({ ...data, id: '3' } as AdminUser)
        )

      const resultAdminUser = createAdminUserEntityMock({
        id: '3',
        name: adminSetInput.name,
        email: adminSetInput.email,
        role: createRoleEntityMock({ name: adminSetInput.role }),
        password: `hash_12345`,
        createdBy: createdByAdmin,
      })

      const result = await adminUserService.createUser(adminSetInput, 'token')

      expect(result).toEqual(resultAdminUser)
    })
  })

  describe('updateUser', () => {
    const strictConfig = {
      token: 'token',
      strictResourceName: 'course' as
        | 'course'
        | 'blog'
        | 'permission'
        | 'user'
        | 'instructor'
        | 'notification',
    }

    it('should throw NotFound error if cannot find any role', async () => {
      jest.spyOn(adminUserService, 'findById').mockResolvedValue(undefined)
      jest.spyOn(roleServiceMock, 'findRoleByName').mockResolvedValue(undefined)

      await assertThrowError(
        adminUserService.updateUser.bind(
          adminUserService,
          'id',
          adminSetInput,
          strictConfig
        ),
        new NotFoundException('Role not found')
      )
    })

    it('should throw NotFound error if cannot find any user', async () => {
      jest.spyOn(adminUserService, 'findById').mockResolvedValue(undefined)
      jest
        .spyOn(roleServiceMock, 'findRoleByName')
        .mockResolvedValue(createRoleEntityMock({ name: 'admin' }))

      await assertThrowError(
        adminUserService.updateUser.bind(
          adminUserService,
          'id',
          adminSetInput,
          strictConfig
        ),
        new NotFoundException('User not found')
      )
    })

    it('should update adminUser successfully', async () => {
      const foundAdmin = createAdminUserEntityMock({ id: '1', name: 'yasuo' })
      const existedRole = createRoleEntityMock({ name: adminSetInput.role })

      jest.spyOn(adminUserService, 'findById').mockResolvedValue(foundAdmin)
      jest
        .spyOn(roleServiceMock, 'findRoleByName')
        .mockResolvedValue(existedRole)

      jest
        .spyOn(adminRepo, 'save')
        .mockImplementation(async (entity) =>
          Promise.resolve(entity as AdminUser)
        )

      foundAdmin.email = adminSetInput.email
      foundAdmin.name = adminSetInput.name
      foundAdmin.role = existedRole
      foundAdmin.password = 'hash_12345'

      const result = await adminUserService.updateUser(
        'id',
        adminSetInput,
        strictConfig
      )

      expect(result).toEqual(foundAdmin)
    })
  })
})
