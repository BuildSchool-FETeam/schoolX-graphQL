import { Test } from '@nestjs/testing'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { AdminUserSetInput } from 'src/graphql'
import { AdminUserMutationResolver } from 'src/adminUser/resolvers/adminUserMutation.resolver'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { guardMock } from 'src/common/mock/guardMock'
import { requestMock } from 'src/common/mock/requestObjectMock'
import {
  createAdminUserEntityMock,
  createRoleEntityMock,
} from 'src/common/mock/mockEntity'

const MOCK_ROLE_NAME = 'servant'

const adminUserServiceMock = {
  createUser() {
    return createAdminUserEntityMock({
      role: createRoleEntityMock({ name: MOCK_ROLE_NAME }),
    })
  },
  updateUser() {
    return createAdminUserEntityMock({
      name: 'jest',
      role: createRoleEntityMock({ name: MOCK_ROLE_NAME }),
    })
  },

  async deleteOneById() {
    return Promise.resolve('ok')
  },
}

describe('AdminUserMutationResolver', () => {
  let resolver: AdminUserMutationResolver
  let adminUserService: AdminUserService

  beforeAll(async () => {
    const testingModule = Test.createTestingModule({
      providers: [AdminUserMutationResolver, AdminUserService],
    })

    testingModule
      .overrideProvider(AdminUserService)
      .useValue(adminUserServiceMock)

    testingModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testingModule.compile()

    resolver = compiledModule.get(AdminUserMutationResolver)
    adminUserService = compiledModule.get(AdminUserService)
  })

  describe('setAdminUser', () => {
    const data: AdminUserSetInput = {
      email: 'test@test.com',
      name: 'Leesin',
      role: 'admin',
    }
    it('should create admin user without input id', async () => {
      const spyCreate = jest.spyOn(adminUserService, 'createUser')
      const result = await resolver.setAdminUser(data, requestMock, undefined)

      expect(result).toEqual({
        ...createAdminUserEntityMock(),
        role: MOCK_ROLE_NAME,
      })
      expect(spyCreate).toHaveBeenCalled()
    })

    it('should update admin user with id pass in', async () => {
      const spyUpdate = jest.spyOn(adminUserService, 'updateUser')
      const result = await resolver.setAdminUser(data, requestMock, 'id')

      expect(result).toEqual({
        ...createAdminUserEntityMock({ name: 'jest' }),
        role: MOCK_ROLE_NAME,
      })
      expect(spyUpdate).toHaveBeenCalled()
    })
  })

  describe('deleteAdminUser', () => {
    it('should delete an adminUser with provided id', async () => {
      const result = await resolver.deleteAdminUser('id')

      expect(result).toBeTruthy()
    })
  })
})
