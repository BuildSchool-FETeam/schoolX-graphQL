import {
  createAdminUserEntityMock,
  createPermissionSetEntityMock,
  createRoleEntityMock,
} from 'src/common/mock/mockEntity'
import { Role } from 'src/permission/entities/Role.entity'
import { RoleService } from '../role.service'
import { TokenService } from 'src/common/services/token.service'
import { CacheService } from 'src/common/services/cache.service'
import { Repository } from 'typeorm'
import { PermissionSet } from 'src/permission/entities/Permission.entity'
import { Test } from '@nestjs/testing'
import { PermissionService } from '../permission.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import {
  QueryBuilderMock,
  repositoryMockFactory,
} from 'src/common/mock/repositoryMock'
import { DEFAULT_PERM } from 'src/common/constants/permission.constant'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { NotFoundException } from '@nestjs/common'

const roleServiceMock = {
  async createAdminRole() {
    const role = new Role()
    role.name = 'role_name'

    return Promise.resolve(role)
  },
  async findRoleByName() {
    return Promise.resolve({})
  },
  async createRole() {
    return Promise.resolve({})
  },
  async updateRole() {
    return Promise.resolve({})
  },
  async deleteRoleByName() {
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

describe('PermissionService', () => {
  let roleService: RoleService
  let tokenService: TokenService
  let permissionRepo: Repository<PermissionSet>
  let permissionService: PermissionService

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        PermissionService,
        RoleService,
        CacheService,
        TokenService,
        {
          provide: getRepositoryToken(PermissionSet),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule.overrideProvider(RoleService).useValue(roleServiceMock)
    setupTestModule.overrideProvider(CacheService).useValue(cacheServiceMock)
    setupTestModule.overrideProvider(TokenService).useValue(tokenServiceMock)

    const compiledModule = await setupTestModule.compile()

    permissionRepo = compiledModule.get(getRepositoryToken(PermissionSet))
    roleService = compiledModule.get(RoleService)
    tokenService = compiledModule.get(TokenService)
    permissionService = compiledModule.get(PermissionService)
  })

  describe('createAdminPermission', () => {
    const { ROOT } = DEFAULT_PERM
    const role = new Role()
    const adminUser = createAdminUserEntityMock()
    const permissionAdmin: PermissionSet = createPermissionSetEntityMock({
      blog: ROOT,
      course: ROOT,
      instructor: ROOT,
      permission: ROOT,
      notification: ROOT,
      user: ROOT,
      role,
      createdBy: adminUser,
    })

    it('Create Admin Permission Root', async () => {
      const spyCreatePerm = jest.spyOn(permissionRepo, 'create')
      jest
        .spyOn(permissionRepo, 'create')
        .mockImplementation((data: PermissionSet) =>
          createPermissionSetEntityMock({ ...data, role, createdBy: adminUser })
        )

      const result = permissionService.createAdminPermission()

      expect(result).toEqual(permissionAdmin)
      expect(spyCreatePerm).toHaveBeenCalled()
    })
  })

  describe('getClientUserPermission', () => {
    const { READ_ONLY, UPDATE_SELF, DENINED } = DEFAULT_PERM
    const userPermission = createPermissionSetEntityMock({
      course: READ_ONLY,
      blog: UPDATE_SELF,
      instructor: READ_ONLY,
      user: READ_ONLY,
      permission: DENINED,
      notification: READ_ONLY,
    })
    const role = createRoleEntityMock({
      id: '1',
      name: 'client_permission',
      permissionSet: userPermission,
    })

    let spyFindRoleByName

    beforeEach(() => {
      jest.clearAllMocks()
      spyFindRoleByName = jest.spyOn(roleService, 'findRoleByName')
    })

    afterEach(() => {
      expect(spyFindRoleByName).toHaveBeenCalled()
    })

    it('If role existed, should return role', async () => {
      jest
        .spyOn(roleService, 'findRoleByName')
        .mockImplementation(async (name) =>
          createRoleEntityMock({ id: '1', name, permissionSet: userPermission })
        )

      const result = await permissionService.getClientUserPermission()

      expect(result).toEqual(role)
    })

    it('If role not existed, should create new role', async () => {
      jest.spyOn(roleService, 'findRoleByName').mockResolvedValue(undefined)

      const spyCreatePerm = jest
        .spyOn(permissionRepo, 'create')
        .mockImplementation((data: PermissionSet) =>
          createPermissionSetEntityMock(data)
        )
      const spyCreateRole = jest
        .spyOn(roleService, 'createRole')
        .mockImplementation(async (name: string) =>
          createRoleEntityMock({ id: '1', name, permissionSet: userPermission })
        )
      const spySavePermission = jest
        .spyOn(permissionRepo, 'save')
        .mockResolvedValue({} as PermissionSet)

      const result = await permissionService.getClientUserPermission()
      expect(result).toEqual(role)
      expect(
        permissionRepo.create({
          course: READ_ONLY,
          blog: UPDATE_SELF,
          instructor: READ_ONLY,
          user: READ_ONLY,
          permission: DENINED,
          notification: READ_ONLY,
        })
      ).toEqual(userPermission)
      expect(spyCreatePerm).toHaveBeenCalled()
      expect(spyCreateRole).toHaveBeenCalled()
      expect(spySavePermission).toBeCalled()
    })
  })

  describe('savePermissionSet', () => {
    const { READ_ONLY, UPDATE_SELF, DENINED } = DEFAULT_PERM
    const userPermission = createPermissionSetEntityMock({
      course: READ_ONLY,
      blog: UPDATE_SELF,
      instructor: READ_ONLY,
      user: READ_ONLY,
      permission: DENINED,
      notification: READ_ONLY,
    })
    it('Should save permission set', async () => {
      const spySavePerm = jest
        .spyOn(permissionRepo, 'save')
        .mockImplementation(async (data: PermissionSet) =>
          createPermissionSetEntityMock(data)
        )

      const result = await permissionService.savePermissionSet({
        course: READ_ONLY,
        blog: UPDATE_SELF,
        instructor: READ_ONLY,
        user: READ_ONLY,
        permission: DENINED,
        notification: READ_ONLY,
      } as PermissionSet)

      expect(result).toEqual(userPermission)
      expect(spySavePerm).toHaveBeenCalled()
    })
  })

  describe('createPermission', () => {
    const { READ_ONLY, UPDATE_SELF, DENINED } = DEFAULT_PERM
    const permission = {
      course: READ_ONLY,
      blog: UPDATE_SELF,
      instructor: READ_ONLY,
      user: READ_ONLY,
      permission: DENINED,
      notification: READ_ONLY,
    }
    const input = {
      roleName: 'user',
      ...permission,
    }
    const permissionResult = createPermissionSetEntityMock({
      ...permission,
      createdBy: createAdminUserEntityMock(),
      role: createRoleEntityMock({ id: '1', name: input.roleName }),
    })

    it('It should create new permission', async () => {
      const spyCreateRole = jest
        .spyOn(roleService, 'createRole')
        .mockImplementation(async (name: string) =>
          createRoleEntityMock({ id: '1', name })
        )
      const spyGetAdminUserByToken = jest
        .spyOn(tokenService, 'getAdminUserByToken')
        .mockResolvedValue(createAdminUserEntityMock())
      const spyPermissionCreate = jest
        .spyOn(permissionRepo, 'create')
        .mockImplementation((data: PermissionSet) =>
          createPermissionSetEntityMock(data)
        )
      const spyPermissionSave = jest
        .spyOn(permissionRepo, 'save')
        .mockImplementation(async (data: PermissionSet) => data)

      const result = await permissionService.createPermission(input, 'token')
      expect(result).toEqual({
        permissionSet: permissionResult,
        name: input.roleName,
      })
      expect(spyCreateRole).toHaveBeenCalled()
      expect(spyGetAdminUserByToken).toHaveBeenCalled()
      expect(spyPermissionCreate).toHaveBeenCalled()
      expect(spyPermissionSave).toHaveBeenCalled()
    })
  })

  describe('updatePermission', () => {
    const id = 'id'

    it("If permission set doesn't exist, should throw now found", async () => {
      const spyFindPermission = jest
        .spyOn(permissionService, 'findById')
        .mockResolvedValue(undefined)

      assertThrowError(
        permissionService.updatePermission.bind(permissionService, id, {}, {}),
        new NotFoundException(`Resource with id "${id}" not found`)
      )

      expect(spyFindPermission).toHaveBeenCalled()
    })

    it('It should update permission', async () => {
      const { READ_ONLY, UPDATE_SELF, DENINED } = DEFAULT_PERM
      const permission = {
        course: READ_ONLY,
        blog: UPDATE_SELF,
        instructor: READ_ONLY,
        user: READ_ONLY,
        permission: DENINED,
        notification: READ_ONLY,
      }
      const permissionInput = {
        roleName: 'user 2',
        ...permission,
      }
      const spyFindPermission = jest
        .spyOn(permissionService, 'findById')
        .mockResolvedValue(
          createPermissionSetEntityMock({
            role: createRoleEntityMock({ id: '1', name: 'user' }),
          })
        )
      const spyUpdateRole = jest
        .spyOn(roleService, 'updateRole')
        .mockResolvedValue(
          createRoleEntityMock({ id: '1', name: permissionInput.roleName })
        )
      const spySavePerm = jest
        .spyOn(permissionRepo, 'save')
        .mockImplementation(async (data: PermissionSet) => data)

      const result = await permissionService.updatePermission(
        id,
        permissionInput,
        null
      )

      expect(result).toEqual({
        name: permissionInput.roleName,
        permissionSet: createPermissionSetEntityMock({
          ...permission,
          role: createRoleEntityMock({
            id: '1',
            name: permissionInput.roleName,
          }),
        }),
      })
      expect(spyFindPermission).toHaveBeenCalled()
      expect(spyUpdateRole).toHaveBeenCalled()
      expect(spySavePerm).toHaveBeenCalled()
    })
  })

  describe('deletePermission', () => {
    it('Should delete permission and delete role', async () => {
      const spyFindPermission = jest
        .spyOn(permissionService, 'findById')
        .mockResolvedValue(createPermissionSetEntityMock())
      const spyDeletePermission = jest
        .spyOn(permissionService, 'deleteOneById')
        .mockImplementation()
      const spyDeleteRole = jest
        .spyOn(roleService, 'deleteRoleByName')
        .mockImplementation()

      const result = await permissionService.deletePermission('id', 'token')

      expect(result).toEqual(true)
      expect(spyFindPermission).toHaveBeenCalled()
      expect(spyDeleteRole).toHaveBeenCalled()
      expect(spyDeletePermission).toHaveBeenCalled()
    })
  })

  describe('getPermissionByRole', () => {
    it('Should get permission', async () => {
      const qb = jest.spyOn(permissionRepo, 'createQueryBuilder').mock.results
      const result = await permissionService.getPermissionByRole('role')
      const methods = qb[0].value.mockMethodCalleds

      expect(result).toEqual({})
      expect(
        QueryBuilderMock.countMethodCalleds(methods, 'innerJoinAndSelect')
      ).toEqual(1)
    })
  })
})
