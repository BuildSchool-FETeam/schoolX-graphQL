class PubSub {
  id = 1000

  publish() {
    return jest.fn()
  }
}

jest.mock('graphql-subscriptions', () => ({
  PubSub,
}))
