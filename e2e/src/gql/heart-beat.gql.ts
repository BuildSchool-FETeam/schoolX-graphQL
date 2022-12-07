import { gql } from 'apollo-boost'

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
