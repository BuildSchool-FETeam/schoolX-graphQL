import { Test } from '@nestjs/testing'
import { ClientAuthService } from 'src/clientUser/services/clientAuth.service'
import { ClientUserAuthMutationResolver } from '../clientUserAuthMutation.resolver'
import { TypeUser } from 'src/graphql'

const clientAuthServiceMock = {
  async createClientUser() {
    return Promise.resolve({})
  },

  async loginWithEmailAndPassword() {
    return Promise.resolve({})
  },

  async activateAccount() {
    return Promise.resolve({})
  },

  async sendRestorePassword() {
    return Promise.resolve({})
  },

  async resetPassword() {
    return Promise.resolve({})
  },

  async sendActivateAccount() {
    return Promise.resolve({})
  },
}

describe('ClientUserAuthMutationResolver', () => {
  let resolver: ClientUserAuthMutationResolver
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [ClientUserAuthMutationResolver, ClientAuthService],
    })

    setupTestModule
      .overrideProvider(ClientAuthService)
      .useValue(clientAuthServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(ClientUserAuthMutationResolver)
  })

  describe('clientUserAuthMutation', () => {
    it('It should return empty object', () => {
      expect(resolver.clientUserAuthMutation()).toEqual({})
    })
  })

  describe('signUp', () => {
    it('It should return id and email user', async () => {
      jest
        .spyOn(clientAuthServiceMock, 'createClientUser')
        .mockResolvedValue({ id: 'id', email: 'email' })

      const result = await resolver.signUp({
        email: 'email',
        password: 'pass',
        name: 'name',
        type: TypeUser.LEARNER,
      })

      expect(result).toEqual({ id: 'id', email: 'email' })
    })
  })

  describe('signIn', () => {
    it('It should return id, email, token', async () => {
      jest
        .spyOn(clientAuthServiceMock, 'loginWithEmailAndPassword')
        .mockResolvedValue({
          id: 'id',
          email: 'email',
          token: 'token',
        })

      const result = await resolver.signIn({
        email: 'email',
        password: 'password',
      })

      expect(result).toEqual({
        id: 'id',
        email: 'email',
        token: 'token',
      })
    })
  })

  describe('activateAccount', () => {
    it('It should return true', async () => {
      const activateAccount = jest.spyOn(
        clientAuthServiceMock,
        'activateAccount'
      )
      const result = await resolver.activateAccount('email', 'code')

      expect(result).toEqual(true)
      expect(activateAccount).toHaveBeenCalled()
    })
  })

  describe('sendRestorePassword', () => {
    it('It should return true', async () => {
      const sendRestorePassword = jest.spyOn(
        clientAuthServiceMock,
        'sendRestorePassword'
      )
      const result = await resolver.sendRestorePassword('email')

      expect(result).toEqual(true)
      expect(sendRestorePassword).toHaveBeenCalled()
    })
  })

  describe('resetPassword', () => {
    it('It should return true', async () => {
      const resetPassword = jest.spyOn(clientAuthServiceMock, 'resetPassword')
      const result = await resolver.resetPassword('code', 'pass', 'email')

      expect(result).toEqual(true)
      expect(resetPassword).toHaveBeenCalled()
    })
  })

  describe('sendActivateAccount', () => {
    it('It should return true', async () => {
      const sendActivateAccount = jest.spyOn(
        clientAuthServiceMock,
        'sendActivateAccount'
      )

      const result = await resolver.sendActivateAccount('example@gmail.com')
      expect(result).toEqual(true)
      expect(sendActivateAccount).toHaveBeenCalled()
    })
  })
})
