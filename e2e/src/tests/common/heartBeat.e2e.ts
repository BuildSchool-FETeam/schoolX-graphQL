import { heartBeatAuthGql, heartBeatGql } from 'e2e/src/gql/heart-beat.gql'
import { gqlRequest } from 'e2e/src/utils/api-call'
import { signIn } from 'e2e/src/utils/authUtils'

describe('Heart beat endpoint. #heartBeat #smoke. Query', () => {
  describe('heartBeat', () => {
    it('should return heartbeat data', async () => {
      const data = await gqlRequest(heartBeatGql)

      expect(data).toEqual({
        heartBeat: expect.stringContaining('CI/CD'),
      })
    })
  })

  describe('heartBeatWithAuth', () => {
    let token: string = null

    beforeAll(async () => {
      token = await signIn()
    })

    it('should get data with authentication heartbeat', async () => {
      const data = await gqlRequest(heartBeatAuthGql, {}, token)

      expect(data).toEqual({ heartBeatWithAuth: "You 're authenticated" })
    })

    it('should throw 403 error with authentication heartbeat', async () => {
      try {
        await gqlRequest(heartBeatAuthGql)
      } catch (err) {
        expect(err).toBeDefined()
      }
    })
  })
})
