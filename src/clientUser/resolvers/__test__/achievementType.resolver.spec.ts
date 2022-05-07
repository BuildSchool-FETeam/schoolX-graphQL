import { Test } from '@nestjs/testing'
import { AchievementService } from 'src/clientUser/services/achievement.service'
import {
  createAchievementEntityMock,
  createClientUserEntityMock,
  createCourseEntityMock,
} from 'src/common/mock/mockEntity'
import { PaginationInput } from 'src/graphql'
import { AchievementTypeResolver } from '../achievementType.resolver'

const achievementServiceMock = {
  async findById() {
    return Promise.resolve({})
  },

  async manuallyPagination() {
    return Promise.resolve({})
  },
}

describe('AchievemenTypeResolver', () => {
  let resolver: AchievementTypeResolver
  const achievement = createAchievementEntityMock()
  let findById
  const pg: PaginationInput = {}
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [AchievementTypeResolver, AchievementService],
    })

    setupTestModule
      .overrideProvider(AchievementService)
      .useValue(achievementServiceMock)

    const compiledModule = await setupTestModule.compile()

    resolver = compiledModule.get(AchievementTypeResolver)
  })

  beforeEach(() => {
    jest.resetAllMocks()
    findById = jest
      .spyOn(achievementServiceMock, 'findById')
      .mockResolvedValue(achievement)
  })

  describe('getCourseStudentJoined', () => {
    it('It should return list course is joined', async () => {
      achievement.joinedCourse = [
        createCourseEntityMock({ id: '1' }),
        createCourseEntityMock({ id: '2' }),
      ]

      jest
        .spyOn(achievementServiceMock, 'manuallyPagination')
        .mockResolvedValue(achievement.joinedCourse)

      const result = await resolver.getCoursesStudentJoined(achievement, pg)

      expect(result).toEqual([
        createCourseEntityMock({ id: '1' }),
        createCourseEntityMock({ id: '2' }),
      ])
      expect(findById).toHaveBeenCalled()
    })
  })

  describe('getPeopleStudentFollow', () => {
    it('It should return users following', async () => {
      achievement.follow = [
        createClientUserEntityMock({ id: '1' }),
        createClientUserEntityMock({ id: '2' }),
      ]

      jest
        .spyOn(achievementServiceMock, 'manuallyPagination')
        .mockResolvedValue(achievement.follow)
      const result = await resolver.getPeopleStudentFollow(achievement, pg)

      expect(result).toEqual([
        createClientUserEntityMock({ id: '1' }),
        createClientUserEntityMock({ id: '2' }),
      ])
      expect(findById).toHaveBeenCalled()
    })
  })

  describe('getPeopleFollowedMe', () => {
    it('It should return users follow', async () => {
      achievement.followedBy = [
        createClientUserEntityMock({ id: '1' }),
        createClientUserEntityMock({ id: '2' }),
      ]

      jest
        .spyOn(achievementServiceMock, 'manuallyPagination')
        .mockResolvedValue(achievement.followedBy)
      const result = await resolver.getPeopleFollowedMe(achievement, pg)

      expect(result).toEqual([
        createClientUserEntityMock({ id: '1' }),
        createClientUserEntityMock({ id: '2' }),
      ])
      expect(findById).toHaveBeenCalled()
    })
  })

  describe('getAllCoursesCompleted', () => {
    it('It should return courses is completed', async () => {
      achievement.completedCourses = [
        createCourseEntityMock({ id: '1' }),
        createCourseEntityMock({ id: '2' }),
      ]

      jest
        .spyOn(achievementServiceMock, 'manuallyPagination')
        .mockResolvedValue(achievement.completedCourses)
      const result = await resolver.getAllCoursesCompleted(achievement, pg)

      expect(result).toEqual([
        createCourseEntityMock({ id: '1' }),
        createCourseEntityMock({ id: '2' }),
      ])
      expect(findById).toHaveBeenCalled()
    })
  })
})
