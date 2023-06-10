import { Test } from '@nestjs/testing'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { guardMock } from 'src/common/mock/guardMock'
import { createAdminUserEntityMock } from 'src/common/mock/mockEntity'
import { requestMock } from 'src/common/mock/requestObjectMock'
import { PaginationInput, SearchOptionInput } from 'src/graphql'
import { AdminUserQueryResolver } from '../adminUserQuery.resolver'

const adminUserServiceMock = {
  ...baseServiceMock,

  getTokenFromHttpHeader() {
    return 'token'
  },

  async findWithOptions() {
    return Promise.resolve([
      createAdminUserEntityMock({ id: '1', name: 'leesin' }),
      createAdminUserEntityMock({ id: '2', name: 'yasuo' }),
    ])
  },

  async findById() {
    return Promise.resolve(createAdminUserEntityMock({ id: '1', name: 'zed' }))
  },

  async countingTotalItem() {
    return Promise.resolve(5)
  },

  async validateEmail() {
    return Promise.resolve({})
  },
}

describe('AdminUserQueryResolver', () => {
  let resolver: AdminUserQueryResolver

  beforeAll(async () => {
    const testingModule = Test.createTestingModule({
      providers: [AdminUserQueryResolver, AdminUserService],
    })

    testingModule
      .overrideProvider(AdminUserService)
      .useValue(adminUserServiceMock)

    testingModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testingModule.compile()

    resolver = compiledModule.get(AdminUserQueryResolver)
  })

  describe('adminUserQuery', () => {
    it('should return {}', () => {
      const result = resolver.adminUserQuery()

      expect(result).toEqual({})
    })
  })

  describe('validateEmail', () => {
    it('It should return true', async () => {
      jest.spyOn(adminUserServiceMock, 'validateEmail').mockResolvedValue(true)
      expect(await resolver.validateEmail('example@gmail.com')).toEqual(true)
    })
  })

  describe('adminUsers', () => {
    it('should get all adminUsers when query', async () => {
      const req = requestMock
      const pagination: PaginationInput = {}
      const searchOpt: SearchOptionInput = {
        searchString: 'id',
        searchFields: [],
      }

      const result = await resolver.adminUsers(req, pagination, searchOpt)
      expect(result[0]).toEqual(
        createAdminUserEntityMock({ id: '1', name: 'leesin' })
      )
      expect(result[1]).toEqual(
        createAdminUserEntityMock({ id: '2', name: 'yasuo' })
      )
    })
  })

  describe('adminUser', () => {
    it('should get only one adminUser when query', async () => {
      const result = await resolver.adminUser('id', requestMock)

      expect(result).toEqual(
        createAdminUserEntityMock({ id: '1', name: 'zed' })
      )
    })
  })

  describe('totalAdminUsers', () => {
    it('should get total number of items', async () => {
      const result = await resolver.totalAdminUsers(requestMock)

      expect(result).toEqual(5)
    })
  })
})
