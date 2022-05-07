import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Achievement } from 'src/clientUser/entities/Achivement.entity'
import {
  createAchievementEntityMock,
  createClientUserEntityMock,
  createCourseEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { CourseService } from 'src/courses/services/course.service'
import { ActionCourse, ActionFollow, UpdateJoinedCourse } from 'src/graphql'
import { Repository } from 'typeorm'
import { AchievementService } from '../achievement.service'

const couresServiecMock = {
  async findById() {
    return Promise.resolve({})
  },
}

describe('AchievementService', () => {
  let achievementService: AchievementService
  let achievementRepo: Repository<Achievement>
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        AchievementService,
        CourseService,
        {
          provide: getRepositoryToken(Achievement),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule.overrideProvider(CourseService).useValue(couresServiecMock)

    const compliedModule = await setupTestModule.compile()

    achievementService = compliedModule.get(AchievementService)
    achievementRepo = compliedModule.get(getRepositoryToken(Achievement))
  })

  describe('createEmptyAchievement', () => {
    const user = createClientUserEntityMock()

    it('It should create empty Achievement', async () => {
      jest
        .spyOn(achievementRepo, 'save')
        .mockImplementation(async (data) =>
          createAchievementEntityMock({ ...data } as Achievement)
        )

      const result = await achievementService.createEmptyAchievement(user)

      expect(result).toEqual(createAchievementEntityMock({ clientUser: user }))
    })
  })

  describe('updateScore', () => {
    it('It should score', async () => {
      jest
        .spyOn(achievementService, 'findById')
        .mockResolvedValue(createAchievementEntityMock())
      jest
        .spyOn(achievementRepo, 'save')
        .mockImplementation(async (data) =>
          createAchievementEntityMock({ ...data } as Achievement)
        )

      const result = await achievementService.updateScore('id', 100)

      expect(result).toEqual(createAchievementEntityMock({ score: 100 }))
    })
  })

  describe('updateJoinedCourse', () => {
    const achievement = createAchievementEntityMock()
    beforeAll(() => {
      jest.spyOn(achievementService, 'findById').mockResolvedValue(achievement)
      jest
        .spyOn(couresServiecMock, 'findById')
        .mockResolvedValue(createCourseEntityMock({ id: '1' }))
    })

    describe('It should add course', () => {
      const data: UpdateJoinedCourse = {
        idCourse: 'id',
        action: ActionCourse.JOIN,
      }

      it('It should return false if joined the course', async () => {
        achievement.joinedCourse = [createCourseEntityMock({ id: '1' })]

        const result = await achievementService.updateJoinedCourse('id', data)

        expect(result).toEqual(false)
      })

      it("It should return true if didn't join the course", async () => {
        achievement.joinedCourse = []

        const result = await achievementService.updateJoinedCourse('id', data)

        const save = jest
          .spyOn(achievementRepo, 'save')
          .mockImplementation(async (data) =>
            createAchievementEntityMock({ ...data } as Achievement)
          )

        expect(result).toEqual(true)
        expect(save).toHaveBeenCalled()
        expect(achievement.joinedCourse.length).toEqual(1)
      })
    })

    describe('It should remove course', () => {
      const data: UpdateJoinedCourse = {
        idCourse: '1',
        action: ActionCourse.LEAVE,
      }

      it("It should return false if didn't join course", async () => {
        achievement.joinedCourse = []

        const result = await achievementService.updateJoinedCourse('id', data)

        expect(result).toEqual(false)
      })

      it('It should return true if joined the course', async () => {
        achievement.joinedCourse = [createCourseEntityMock({ id: '1' })]
        const result = await achievementService.updateJoinedCourse('id', data)

        const save = jest
          .spyOn(achievementRepo, 'save')
          .mockImplementation(async (data) =>
            createAchievementEntityMock({ ...data } as Achievement)
          )

        expect(result).toEqual(true)
        expect(save).toHaveBeenCalled()
        expect(achievement.joinedCourse.length).toEqual(0)
      })
    })
  })

  describe('updateFollow', () => {
    const achievement = createAchievementEntityMock()
    beforeAll(() => {
      jest.spyOn(achievementService, 'findById').mockResolvedValue(achievement)
    })

    describe('It should add client user follow', () => {
      const userFollow = createClientUserEntityMock({ id: '1' })
      const action = ActionFollow.FOLLOW

      it('It should return false if followed', async () => {
        achievement.follow = [userFollow]

        const result = await achievementService.updateFollow(
          'id',
          userFollow,
          action
        )

        expect(result).toEqual(false)
      })

      it("It should return true if didn't follow", async () => {
        achievement.follow = []

        const result = await achievementService.updateFollow(
          'id',
          userFollow,
          action
        )

        const save = jest
          .spyOn(achievementRepo, 'save')
          .mockImplementation(async (data) =>
            createAchievementEntityMock({ ...data } as Achievement)
          )

        expect(result).toEqual(true)
        expect(save).toHaveBeenCalled()
        expect(achievement.follow.length).toEqual(1)
      })
    })

    describe('It should remove client user follow', () => {
      const userFollow = createClientUserEntityMock({ id: '1' })
      const action = ActionFollow.UNFOLLOW

      it("It should return false if didn't follow", async () => {
        achievement.follow = []

        const result = await achievementService.updateFollow(
          'id',
          userFollow,
          action
        )

        expect(result).toEqual(false)
      })

      it('It should return true if followed', async () => {
        achievement.follow = [userFollow]

        const result = await achievementService.updateFollow(
          'id',
          userFollow,
          action
        )

        const save = jest
          .spyOn(achievementRepo, 'save')
          .mockImplementation(async (data) =>
            createAchievementEntityMock({ ...data } as Achievement)
          )

        expect(result).toEqual(true)
        expect(save).toHaveBeenCalled()
        expect(achievement.follow.length).toEqual(0)
      })
    })
  })

  describe('updateFollowedMe', () => {
    const achievement = createAchievementEntityMock()
    const userFollowed = createClientUserEntityMock({ id: '1' })
    let save

    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(achievementService, 'findById').mockResolvedValue(achievement)
      save = jest
        .spyOn(achievementRepo, 'save')
        .mockImplementation(async (data) =>
          createAchievementEntityMock({ ...data } as Achievement)
        )
    })

    it('It should add user followed', async () => {
      const result = await achievementService.updateFollowedMe(
        'id',
        userFollowed,
        ActionFollow.FOLLOW
      )

      expect(result).toEqual(true)
      expect(save).toHaveBeenCalled()
      expect(achievement.followedBy.length).toEqual(1)
    })

    it('It should remove user followed', async () => {
      achievement.followedBy = [userFollowed]

      const result = await achievementService.updateFollowedMe(
        'id',
        userFollowed,
        ActionFollow.UNFOLLOW
      )

      expect(result).toEqual(true)
      expect(save).toHaveBeenCalled()
      expect(achievement.followedBy.length).toEqual(0)
    })
  })

  describe('updateCompletedCourse', () => {
    const achievement = createAchievementEntityMock()
    let findByIdCourse

    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(achievementService, 'findById').mockResolvedValue(achievement)
      findByIdCourse = jest
        .spyOn(couresServiecMock, 'findById')
        .mockResolvedValue(createCourseEntityMock({ id: '1' }))
    })

    it('It should return false if course completed', async () => {
      achievement.completedCourses = [createCourseEntityMock({ id: '1' })]
      const result = await achievementService.updateCompletedCourses('id', '1')

      expect(result).toEqual(false)
      expect(findByIdCourse).toHaveBeenCalled()
    })

    it("It should return false if didn't join course", async () => {
      achievement.completedCourses = []

      const result = await achievementService.updateCompletedCourses('id', '1')

      expect(result).toEqual(false)
      expect(findByIdCourse).toHaveBeenCalled()
    })

    it('It should return true and update completedCourse', async () => {
      achievement.joinedCourse = [createCourseEntityMock({ id: 1 } as unknown)]
      const save = jest
        .spyOn(achievementRepo, 'save')
        .mockImplementation(async (data) =>
          createAchievementEntityMock({ ...data } as Achievement)
        )
      const result = await achievementService.updateCompletedCourses('id', '1')

      expect(result).toEqual(true)
      expect(save).toHaveBeenCalled()
      expect(findByIdCourse).toHaveBeenCalled()
      expect(achievement.completedCourses.length).toEqual(1)
    })
  })
})
