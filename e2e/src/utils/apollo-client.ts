import ApolloClient, { InMemoryCache } from 'apollo-boost'
const host = process.env.HOST || 'localhost:3001'
const isNotDebug = process.env.DEBUGGING === 'false'

export const getClient = (token?: string) =>
  new ApolloClient({
    uri: `http://${host}/graphql`,
    cache: new InMemoryCache(),
    request: (operation) => {
      if (token) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    },
    onError: (e) => {
      if (!isNotDebug) {
        console.log(e)
      }
    },
  })
