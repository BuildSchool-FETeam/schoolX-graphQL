import { Test } from '@nestjs/testing'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { guardMock } from 'src/common/mock/guardMock'
import {
  createAdminUserEntityMock,
  createEvaluationCommentEntityMock,
  createRoleEntityMock,
} from 'src/common/mock/mockEntity'
import { AdminUserTypeResolver } from '../adminUserType.Resolver'

const adminUserServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}

describe('AdminUserType', () => {
  let resolver: AdminUserTypeResolver

  beforeAll(async () => {
    const testingModule = Test.createTestingModule({
      providers: [AdminUserTypeResolver, AdminUserService],
    })

    testingModule
      .overrideProvider(AdminUserService)
      .useValue(adminUserServiceMock)

    testingModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testingModule.compile()

    resolver = compiledModule.get(AdminUserTypeResolver)
  })

  const findByIdSpy = jest.spyOn(adminUserServiceMock, 'findById')

  describe('role', () => {
    it("should return role's name", async () => {
      const adminUser = createAdminUserEntityMock()
      adminUser.role = createRoleEntityMock({ name: 'zed' })

      findByIdSpy.mockResolvedValue(adminUser)

      const result = await resolver.role(adminUser)
      expect(result).toBe('zed')
    })
  })

  describe('createdBy', () => {
    it('should return a user that created this adminUser', async () => {
      const createdAdminUser = createAdminUserEntityMock({
        id: '2',
        name: 'yasuo',
      })
      const foundAdminUser = createAdminUserEntityMock({
        name: 'zed',
        createdBy: createdAdminUser,
      })

      findByIdSpy.mockResolvedValue(foundAdminUser)

      const result = await resolver.createdBy(foundAdminUser)
      expect(result).toEqual(createdAdminUser)
    })
  })

  describe('evvaluationComments', () => {
    it('should return evaluations comment related to this adminUser', async () => {
      const evaluationComment = createEvaluationCommentEntityMock()
      const foundAdminUser = createAdminUserEntityMock({
        name: 'zed',
        evaluationComments: [evaluationComment],
      })

      findByIdSpy.mockResolvedValue(foundAdminUser)

      const result = await resolver.evaluationComments(foundAdminUser)

      expect(result[0]).toEqual(evaluationComment)
    })
  })
})
