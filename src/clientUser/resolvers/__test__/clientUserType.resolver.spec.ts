import { Test } from '@nestjs/testing'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import {
  createAchievementEntityMock,
  createClientUserEntityMock,
} from 'src/common/mock/mockEntity'
import { clientUserTypeResolver } from '../clientUserType.resolver'
import { TypeUser } from 'src/graphql'

const clientUserServiceMock = {
  ...baseServiceMock,
}

describe('ClientUserTypeResolver', () => {
  let resolver: clientUserTypeResolver
  const clientUser = createClientUserEntityMock()
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [clientUserTypeResolver, ClientUserService],
    })

    setupTestModule
      .overrideProvider(ClientUserService)
      .useValue(clientUserServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(clientUserTypeResolver)
  })

  describe('type', () => {
    it('It should return type of user', () => {
      const result = resolver.type(clientUser)
      expect(result).toEqual(TypeUser.LEARNER)
    })
  })

  describe('achievement', () => {
    it('It should return Achievement', async () => {
      clientUser.achievement = createAchievementEntityMock()

      jest
        .spyOn(clientUserServiceMock, 'findById')
        .mockResolvedValue(clientUser)

      const result = await resolver.achievement(clientUser)

      expect(result).toEqual(createAchievementEntityMock())
    })
  })
})
