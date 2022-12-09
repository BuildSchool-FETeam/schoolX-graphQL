import { DocumentNode } from 'graphql'
import { getClient } from './apollo-client'

export const gqlQuery = async <T, V = object>(
  gqlDoc: DocumentNode,
  variables?: V,
  token?: string
) => {
  const client = getClient(token)
  const response = await client.query<T, V>({ query: gqlDoc, variables })

  return response.data
}

export const gqlMutation = async <T, V>(
  gqlDoc: DocumentNode,
  variables?: V,
  token?: string
) => {
  const client = getClient(token)
  const response = await client.mutate<T, V>({ mutation: gqlDoc, variables })

  return response.data
}
