import { gql } from 'graphql-request'

export const heartBeatGql = gql`
  query HeartBeat {
    heartBeat
  }
`

export const heartBeatAuthGql = gql`
  query HeartBeataAuth {
    heartBeatWithAuth
  }
`
