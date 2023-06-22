import { GraphQLClient } from 'graphql-request'
const host = process.env.HOST || 'localhost:3001'
const endpoint = `http://${host}/graphql`

console.log('HOST', endpoint)
export const getClient = () => new GraphQLClient(endpoint)
