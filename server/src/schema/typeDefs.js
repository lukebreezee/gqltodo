const { gql } = require('apollo-server-express')

const typeDefs = gql`
  # ------------------ Schema ------------------

  type User {
    name: String!
    email: String!
    passhash: String!
    id: Int!
  }

  # ------------------ Response ------------------

  type GeneralResponse {
    success: Boolean!
    message: String!
  }

  type SignInResponse {
    success: Boolean!
    message: String!
    accessToken: String!
    refreshToken: String!
  }

  type GetUserResponse {
    success: Boolean!
    message: String!
    user: User
    code: Int
  }

  type GenerateNewTokenResponse {
    success: Boolean!
    message: String!
    accessToken: String
    code: Int
  }

  # ------------------ Queries ------------------

  type Query {
    getAllUsers: [User!]!
  }

  type Query {
    getUser: GetUserResponse!
  }

  # ------------------ Mutations ------------------

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
    ): GeneralResponse!
  }

  type Mutation {
    signIn(email: String!, password: String!): SignInResponse!
  }

  type Mutation {
    generateNewToken(refreshToken: String!): GenerateNewTokenResponse!
  }
`

module.exports = typeDefs
