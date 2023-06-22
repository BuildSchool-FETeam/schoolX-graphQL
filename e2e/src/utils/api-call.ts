import { DocumentNode } from 'graphql'
import { getClient } from './apollo-client'
import { Variables } from 'graphql-request/build/esm/types'

export const gqlRequest = async <
  T,
  V extends Variables = Record<string, never>
>(
  gqlDoc: DocumentNode | string,
  variables?: V,
  token?: string
) => {
  const client = getClient()

  if (token) {
    client.setHeader('Authorization', `Bearer ${token}`)
  }
  const response = await client.request<T>(gqlDoc, variables)

  return response
}
