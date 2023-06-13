import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createAchievementEntityMock,
  createClientUserEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { StreamMock } from 'src/common/mock/StreamMock'
import { GCStorageService } from 'src/common/services/GCStorage.service'
import { TokenService } from 'src/common/services/token.service'
import { CourseService } from 'src/courses/services/course.service'
import { ActionCourse, ActionFollow, ClientUserUpdateInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { ReadStream } from 'typeorm/platform/PlatformTools'
import { AchievementService } from '../achievement.service'
import { ClientUserService } from '../clientUser.service'

const gcStorageServiceMock = {
  async uploadFile() {
    return Promise.resolve({})
  },

  async deleteFile() {
    return Promise.resolve({})
  },
}
const achievementServiceMock = {
  async updateScore() {
    return Promise.resolve({})
  },

  async updateFollow() {
    return Promise.resolve({})
  },

  async updateFollowedMe() {
    return Promise.resolve({})
  },

  async updateJoinedCourse() {
    return Promise.resolve({})
  },

  async updateCompletedCourses() {
    return Promise.resolve({})
  },
}
const tokenServiceMock = {
  verifyAndDecodeToken() {
    return {}
  },
}
const courseServiceMock = {
  async updateJoinedUsers() {
    return Promise.resolve({})
  },

  async updateCompletedUser() {
    return Promise.resolve({})
  },
}

describe('ClientUserService', () => {
  let clientUserRepo: Repository<ClientUser>
  let clientUserService: ClientUserService

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        ClientUserService,
        GCStorageService,
        AchievementService,
        TokenService,
        CourseService,
        {
          provide: getRepositoryToken(ClientUser),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule
      .overrideProvider(GCStorageService)
      .useValue(gcStorageServiceMock)
    setupTestModule
      .overrideProvider(AchievementService)
      .useValue(achievementServiceMock)
    setupTestModule.overrideProvider(TokenService).useValue(tokenServiceMock)
    setupTestModule.overrideProvider(CourseService).useValue(courseServiceMock)

    const comppliedModule = await setupTestModule.compile()

    clientUserRepo = comppliedModule.get(getRepositoryToken(ClientUser))
    clientUserService = comppliedModule.get(ClientUserService)
  })

  describe('validationEmail', () => {
    it('It should return true', async () => {
      jest.spyOn(clientUserService, 'findWithOptions').mockResolvedValue([])

      const result = await clientUserService.validateEmail('example@gmail.com')
      expect(result).toEqual(true)
    })
  })

  describe('updateClientUserInfo', () => {
    it('It should update client user info', async () => {
      const data: ClientUserUpdateInput = {
        name: 'name',
        githubUrl: 'githubUrl',
        dayOfBirth: 'dayOfBirth',
        bio: 'bid',
        homeTown: 'home town',
        phone: 'phone',
      }

      jest
        .spyOn(clientUserService, 'findById')
        .mockResolvedValue(createClientUserEntityMock())

      jest
        .spyOn(clientUserRepo, 'save')
        .mockImplementation(async (data) =>
          createClientUserEntityMock({ ...data } as ClientUser)
        )

      const result = await clientUserService.updateClientUserInfo(data, 'id')

      const expectResult = createClientUserEntityMock({ ...data })

      expect(result).toEqual(expectResult)
    })
  })

  describe('updateUserAvatar', () => {
    const user = createClientUserEntityMock()
    let deleteFile
    beforeAll(() => {
      jest.spyOn(clientUserService, 'findById').mockResolvedValue(user)
      jest.spyOn(gcStorageServiceMock, 'uploadFile').mockResolvedValue({
        filePath: 'file path',
        publicUrl: 'public url',
      })
      jest
        .spyOn(clientUserRepo, 'save')
        .mockImplementation(async (data) =>
          createClientUserEntityMock({ ...data } as ClientUser)
        )
      deleteFile = jest
        .spyOn(gcStorageServiceMock, 'deleteFile')
        .mockResolvedValue(true)
    })

    it('It should create new Avatar without remove old Avatar', async () => {
      user.imageUrl = null

      const result = await clientUserService.updateUserAvatar('id', {
        filename: 'filename',
        mimetype: 'mimetype',
        encoding: 'encoding',
        createReadStream: () => new StreamMock() as unknown as ReadStream,
      })

      expect(result).toEqual(
        createClientUserEntityMock({
          filePath: 'file path',
          imageUrl: 'public url',
        })
      )

      expect(deleteFile).toHaveBeenCalledTimes(0)
    })

    it('It should create new Aavatar and remove old avatar', async () => {
      user.imageUrl = 'old image'

      const result = await clientUserService.updateUserAvatar('id', {
        filename: 'filename',
        mimetype: 'mimetype',
        encoding: 'encoding',
        createReadStream: () => new StreamMock() as unknown as ReadStream,
      })

      expect(result).toEqual(
        createClientUserEntityMock({
          filePath: 'file path',
          imageUrl: 'public url',
        })
      )

      expect(deleteFile).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateScore', () => {
    const user = createClientUserEntityMock({
      achievement: createAchievementEntityMock(),
    })
    let updateScore
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(clientUserService, 'findById').mockResolvedValue(user)
      updateScore = jest
        .spyOn(achievementServiceMock, 'updateScore')
        .mockResolvedValue(createAchievementEntityMock())
    })

    it('It should throw Exception if score input < 0', async () => {
      assertThrowError(
        clientUserService.updateScore.bind(clientUserService, 'id', {
          score: -2,
          isAdd: true,
        }),
        new BadRequestException('A score should be a positive number')
      )
    })

    it('It should subtraction score', async () => {
      await clientUserService.updateScore('id', { score: 100, isAdd: false })

      expect(updateScore).toHaveBeenCalled()
    })

    it('It should add score', async () => {
      await clientUserService.updateScore('id', { score: 100, isAdd: true })

      expect(updateScore).toHaveBeenCalled()
    })
  })

  describe('updateJoinedCourse', () => {
    const user = createClientUserEntityMock({
      achievement: createAchievementEntityMock(),
    })
    let updateJoinedUsers
    beforeEach(() => {
      jest.resetAllMocks()
      updateJoinedUsers = jest
        .spyOn(courseServiceMock, 'updateJoinedUsers')
        .mockResolvedValue(true)
      jest.spyOn(clientUserService, 'findById').mockResolvedValue(user)
    })

    it("It should return false if update doesn't success", async () => {
      jest
        .spyOn(achievementServiceMock, 'updateJoinedCourse')
        .mockResolvedValue(false)

      const result = await clientUserService.updateJoinedCourse('id', {
        idCourse: 'idCourse',
        action: ActionCourse.JOIN,
      })

      expect(result).toEqual(false)
      expect(updateJoinedUsers).toHaveBeenCalledTimes(0)
    })

    it('It should return true if update success', async () => {
      jest
        .spyOn(achievementServiceMock, 'updateJoinedCourse')
        .mockResolvedValue(true)

      const result = await clientUserService.updateJoinedCourse('id', {
        idCourse: 'idCourse',
        action: ActionCourse.JOIN,
      })

      expect(result).toEqual(true)
      expect(updateJoinedUsers).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateFollow', () => {
    const user = createClientUserEntityMock({
      achievement: createAchievementEntityMock(),
    })
    let updateFollowedMe
    let findById
    beforeEach(() => {
      jest.resetAllMocks()
      updateFollowedMe = jest
        .spyOn(achievementServiceMock, 'updateFollowedMe')
        .mockResolvedValue(true)
      findById = jest
        .spyOn(clientUserService, 'findById')
        .mockResolvedValue(user)
    })

    it("It should return false if update doesn't success", async () => {
      jest
        .spyOn(achievementServiceMock, 'updateFollow')
        .mockResolvedValue(false)

      const result = await clientUserService.updateFollow('id', {
        idFollow: 'idFollow',
        action: ActionFollow.FOLLOW,
      })

      expect(result).toEqual(false)
      expect(findById).toHaveBeenCalledTimes(2)
      expect(updateFollowedMe).toHaveBeenCalledTimes(0)
    })

    it('It should return true if update success', async () => {
      jest.spyOn(achievementServiceMock, 'updateFollow').mockResolvedValue(true)

      const result = await clientUserService.updateFollow('id', {
        idFollow: 'idFollow',
        action: ActionFollow.FOLLOW,
      })

      expect(result).toEqual(true)
      expect(updateFollowedMe).toHaveBeenCalled()
      expect(findById).toHaveBeenCalledTimes(2)
    })
  })

  describe('updateCompleteCourses', () => {
    const user = createClientUserEntityMock({
      achievement: createAchievementEntityMock(),
    })
    let updateCompletedUser
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(clientUserService, 'findById').mockResolvedValue(user)
      updateCompletedUser = jest
        .spyOn(courseServiceMock, 'updateCompletedUser')
        .mockResolvedValue(true)
    })

    it("It should return false if update doesn't success", async () => {
      jest
        .spyOn(achievementServiceMock, 'updateCompletedCourses')
        .mockResolvedValue(false)

      const result = await clientUserService.updateCompletedCourses(
        'id',
        'idCourse'
      )

      expect(result).toEqual(false)
      expect(updateCompletedUser).toHaveBeenCalledTimes(0)
    })

    it('It should return true if update success', async () => {
      jest
        .spyOn(achievementServiceMock, 'updateCompletedCourses')
        .mockResolvedValue(true)

      const result = await clientUserService.updateCompletedCourses(
        'id',
        'idCourse'
      )

      expect(result).toEqual(true)
      expect(updateCompletedUser).toHaveBeenCalled()
    })
  })

  describe('getIdUserByHeader', () => {
    it('It should return id user', () => {
      const token = jest
        .spyOn(clientUserService, 'getTokenFromHttpHeader')
        .mockReturnValue('token')
      const id = jest
        .spyOn(tokenServiceMock, 'verifyAndDecodeToken')
        .mockReturnValue({ id: 'id' })

      const result = clientUserService.getIdUserByHeaders({})

      expect(result).toEqual('id')
      expect(token).toHaveBeenCalled()
      expect(id).toHaveBeenCalled()
    })
  })

  describe('findUserById', () => {
    it('It should return client user', async () => {
      const findOne = jest
        .spyOn(clientUserRepo, 'findOne')
        .mockImplementation(async (options) =>
          Promise.resolve(
            createClientUserEntityMock(options.where as Partial<ClientUser>)
          )
        )

      const result = await clientUserService.findUserById('id')

      expect(result).toEqual(createClientUserEntityMock({ id: 'id' }))
      expect(findOne).toHaveBeenCalled()
    })
  })
})
