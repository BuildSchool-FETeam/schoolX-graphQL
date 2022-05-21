import { Test } from '@nestjs/testing'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { guardMock } from 'src/common/mock/guardMock'
import { createClientUserEntityMock } from 'src/common/mock/mockEntity'
import { requestMock } from 'src/common/mock/requestObjectMock'
import { ActionCourse, ActionFollow } from 'src/graphql'
import { ClientUserMutationResolver } from '../clientUserMutation.resolver'

const clientUserServiceMock = {
  async updateClientUserInfo() {
    return Promise.resolve({})
  },

  async updateUserAvatar() {
    return Promise.resolve({})
  },

  getIdUserByHeaders() {
    return 'id'
  },

  async updateScore() {
    return Promise.resolve({})
  },

  async updateJoinedCourse() {
    return Promise.resolve({})
  },

  async updateFollow() {
    return Promise.resolve({})
  },

  async updateCompletedCourses() {
    return Promise.resolve({})
  },
}

describe('ClientUserMutationResolver', () => {
  let resolver: ClientUserMutationResolver
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [ClientUserMutationResolver, ClientUserService],
    })

    setupTestModule
      .overrideProvider(ClientUserService)
      .useValue(clientUserServiceMock)
    setupTestModule.overrideGuard(AuthGuard).useValue(guardMock)
    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(ClientUserMutationResolver)
  })

  describe('clientUserMutation', () => {
    it('It should return empty object', async () => {
      expect(resolver.clientUserMutation()).toEqual({})
    })
  })

  describe('updateClientUser', () => {
    it('It should return user', async () => {
      jest
        .spyOn(clientUserServiceMock, 'updateClientUserInfo')
        .mockResolvedValue(createClientUserEntityMock())

      const result = await resolver.updateClientUser({}, 'id')

      expect(result).toEqual(createClientUserEntityMock())
    })
  })

  describe('updateClientUserAvatar', () => {
    it('It should return user', async () => {
      jest
        .spyOn(clientUserServiceMock, 'updateUserAvatar')
        .mockResolvedValue(createClientUserEntityMock())

      const result = await resolver.updateClientUserAvatar('id', {})

      expect(result).toEqual(createClientUserEntityMock())
    })
  })

  describe('updateScore', () => {
    it('It should return true', async () => {
      const getIdUserByHeaders = jest.spyOn(
        clientUserServiceMock,
        'getIdUserByHeaders'
      )
      const updateScore = jest.spyOn(clientUserServiceMock, 'updateScore')

      const result = await resolver.updateScore(
        { score: 0, isAdd: true },
        requestMock
      )

      expect(result).toEqual(true)
      expect(getIdUserByHeaders).toHaveBeenCalled()
      expect(updateScore).toHaveBeenCalled()
    })
  })

  describe('updateJoinedCourse', () => {
    it('It should return user', async () => {
      const getIdUserByHeaders = jest.spyOn(
        clientUserServiceMock,
        'getIdUserByHeaders'
      )
      jest
        .spyOn(clientUserServiceMock, 'updateJoinedCourse')
        .mockResolvedValue(createClientUserEntityMock())

      const result = await resolver.updateJoinedCourse(
        { idCourse: 'idCourse', action: ActionCourse.JOIN },
        requestMock
      )

      expect(result).toEqual(createClientUserEntityMock())
      expect(getIdUserByHeaders).toHaveBeenCalled()
    })
  })

  describe('updateFollow', () => {
    let getIdUserByHeaders
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(clientUserServiceMock, 'updateFollow').mockResolvedValue(true)
      getIdUserByHeaders = jest
        .spyOn(clientUserServiceMock, 'getIdUserByHeaders')
        .mockReturnValue('id')
    })

    it('It should return false if id is invalid', async () => {
      const result = await resolver.updateFollow(
        { idFollow: 'id', action: ActionFollow.FOLLOW },
        requestMock
      )

      expect(result).toEqual(false)
      expect(getIdUserByHeaders).toHaveBeenCalled()
    })

    it('It should return true', async () => {
      const result = await resolver.updateFollow(
        { idFollow: '1', action: ActionFollow.FOLLOW },
        requestMock
      )

      expect(result).toEqual(true)
      expect(getIdUserByHeaders).toHaveBeenCalled()
    })
  })

  describe('updateCompletedCourses', () => {
    it('It should return true', async () => {
      const getIdUserByHeaders = jest.spyOn(
        clientUserServiceMock,
        'getIdUserByHeaders'
      )
      jest
        .spyOn(clientUserServiceMock, 'updateCompletedCourses')
        .mockResolvedValue(true)

      const result = await resolver.updateCompletedCourses('id', requestMock)

      expect(result).toEqual(true)
      expect(getIdUserByHeaders).toHaveBeenCalled()
    })
  })
})
