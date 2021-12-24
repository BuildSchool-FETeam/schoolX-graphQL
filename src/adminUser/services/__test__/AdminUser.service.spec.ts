import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { assign } from 'lodash'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
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
    return Promise.resolve(createAdminUser({ id: '2', name: 'yasuo' }))
  },
}
const cacheServiceMock = {
  getValue() {
    return 'value'
  },
}

const createAdminUser = (data?: Partial<AdminUser>) => {
  const defaultData = {
    id: '1',
    name: 'leesin',
    email: 'test@test.com',
    password: 'Leesin123',
    role: new Role(),
    evaluationComments: [],
    createdBy: new AdminUser(),
  }

  return assign(new AdminUser(), { ...defaultData, ...data })
}

const createNewRole = (role: Partial<Role>) => {
  return assign(new Role(), { ...role })
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

  describe('findUserByEmail', () => {
    const adminUser: AdminUser = createAdminUser()

    it('should find a user by email', async () => {
      jest.spyOn(adminRepo, 'findOne').mockResolvedValue(adminUser)
      const result = await adminUserService.findUserByEmail('test@test.com')

      expect(result).toEqual(adminUser)
    })
  })

  describe('createUserBySignup', () => {
    it('should throw error when exist at least one admin in DB', async () => {
      jest.spyOn(adminRepo, 'count').mockResolvedValue(1)
      const adminUser = createAdminUser()

      try {
        await adminUserService.createUserBySignup(adminUser)
      } catch (e) {
        expect(e).toEqual(
          new BadRequestException('Only have one admin created by this way')
        )
      }
    })

    it('should create and save an adminUser if there is no admin user in DB', async () => {
      const adminUser = createAdminUser()

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

      try {
        await adminUserService.createUser(adminSetInput, 'token')
      } catch (e) {
        expect(e).toEqual(new NotFoundException('This role is not existed'))
      }
    })

    it('should throw NotFound error when the email has been registered', async () => {
      jest
        .spyOn(roleServiceMock, 'findRoleByName')
        .mockResolvedValue(new Role())
      jest.spyOn(adminRepo, 'find').mockResolvedValue([createAdminUser()])

      try {
        await adminUserService.createUser(adminSetInput, 'token')
      } catch (e) {
        expect(e).toEqual(
          new NotFoundException('This user email has been taken!')
        )
      }
    })

    it("should throw BadRequest error user don't provide password", async () => {
      jest.spyOn(roleServiceMock, 'findRoleByName').mockResolvedValue({})
      jest.spyOn(adminRepo, 'find').mockResolvedValue([])
      adminSetInput.password = null

      try {
        await adminUserService.createUser(adminSetInput, 'token')
      } catch (e) {
        expect(e).toEqual(
          new BadRequestException('Cannot create an adminUser without password')
        )
      }
    })

    it('should create an adminUser', async () => {
      const role = createNewRole({ name: 'admin' })
      const createdByAdmin = createAdminUser({ id: '2', name: 'yasuo' })

      jest.spyOn(roleServiceMock, 'findRoleByName').mockResolvedValue(role)
      jest.spyOn(adminRepo, 'find').mockResolvedValue([])
      jest
        .spyOn(tokenServiceMock, 'getAdminUserByToken')
        .mockResolvedValue(createdByAdmin)

      jest
        .spyOn(adminRepo, 'save')
        .mockImplementation(async (data) =>
          createAdminUser({ ...data, id: '3' } as AdminUser)
        )

      const resultAdminUser = createAdminUser({
        id: '3',
        name: adminSetInput.name,
        email: adminSetInput.email,
        role: createNewRole({ name: adminSetInput.role }),
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

      try {
        await adminUserService.updateUser('id', adminSetInput, strictConfig)
      } catch (e) {
        expect(e).toEqual(new NotFoundException('Role not found'))
      }
    })

    it('should throw NotFound error if cannot find any user', async () => {
      jest.spyOn(adminUserService, 'findById').mockResolvedValue(undefined)
      jest
        .spyOn(roleServiceMock, 'findRoleByName')
        .mockResolvedValue(createNewRole({ name: 'admin' }))

      try {
        await adminUserService.updateUser('id', adminSetInput, strictConfig)
      } catch (e) {
        expect(e).toEqual(new NotFoundException('User not found'))
      }
    })

    it('should update adminUser successfully', async () => {
      const foundAdmin = createAdminUser({ id: '1', name: 'yasuo' })
      const existedRole = createNewRole({ name: adminSetInput.role })

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
