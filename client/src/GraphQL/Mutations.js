import { gql } from '@apollo/client'

export const CREATE_USER_MUTATION = gql`
  mutation createUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      success
      message
    }
  }
`

export const SIGN_IN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      success
      message
      accessToken
      refreshToken
    }
  }
`

export const GENERATE_NEW_TOKEN_MUTATION = gql`
  mutation generateNewToken($refreshToken: String!) {
    generateNewToken(refreshToken: $refreshToken) {
      success
      accessToken
      code
    }
  }
`
