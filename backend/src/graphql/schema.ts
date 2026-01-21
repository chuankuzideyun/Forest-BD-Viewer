import { gql } from "apollo-server-express"

export const typeDefs = gql`
  scalar JSON

  type User {
    id: ID!
    email: String!
    lastMapState: JSON
  }

  type Forest {
    id: ID!
    geom: JSON!
  }

  type Query {
    me: User
    forests(bbox: [Float!]!): [Forest!]!
  }

  type Mutation {
    register(email: String!, password: String!): Boolean
    login(email: String!, password: String!): String
    saveMapState(state: JSON!): Boolean
  }
`
