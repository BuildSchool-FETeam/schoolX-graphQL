import { SubscriptionService } from '../subscription.service'

describe('SubscriptionService', () => {
  const service = new SubscriptionService()

  describe('publish', () => {
    it('should publish event with data', () => {
      expect(service.publish('id', {})).toBe(undefined)
    })
  })

  describe('createChannelId', () => {
    it('should return only channel name', () => {
      expect(service.createChannelId('NAME')).toEqual('NAME')
    })

    it('should return channel name with id', () => {
      expect(service.createChannelId('NAME', '123123')).toEqual('NAME_123123')
    })
  })
})
