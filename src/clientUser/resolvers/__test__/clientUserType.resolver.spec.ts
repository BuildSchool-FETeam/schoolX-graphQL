import { Test } from '@nestjs/testing'
import { AchievementService } from 'src/clientUser/services/achievement.service'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'
import {
  createAchievementEntityMock,
  createClientUserEntityMock,
  createInstructorEntiryMock,
} from 'src/common/mock/mockEntity'
import { clientUserTypeResolver } from '../clientUserType.resolver'

const clientUserServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}
const achievementServiceMock = {
  async findWithOptions() {
    return Promise.resolve({})
  },
}

describe('ClientUserTypeResolver', () => {
  let resolver: clientUserTypeResolver
  const clientUser = createClientUserEntityMock()
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        clientUserTypeResolver,
        ClientUserService,
        AchievementService,
      ],
    })

    setupTestModule
      .overrideProvider(ClientUserService)
      .useValue(clientUserServiceMock)
    setupTestModule
      .overrideProvider(AchievementService)
      .useValue(achievementServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(clientUserTypeResolver)
  })

  describe('instructor', () => {
    it('It should return instructor', async () => {
      clientUser.instructor = createInstructorEntiryMock()
      jest
        .spyOn(clientUserServiceMock, 'findById')
        .mockResolvedValue(clientUser)

      const result = await resolver.instructor(clientUser)

      expect(result).toEqual(createInstructorEntiryMock())
    })
  })

  describe('achievement', () => {
    it('It should return Achievement', async () => {
      clientUser.achievement = createAchievementEntityMock()

      jest
        .spyOn(achievementServiceMock, 'findWithOptions')
        .mockResolvedValue([clientUser.achievement])

      const result = await resolver.achievement(clientUser)

      expect(result).toEqual(createAchievementEntityMock())
    })
  })
})
