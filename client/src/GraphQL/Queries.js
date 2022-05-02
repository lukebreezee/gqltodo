import { gql } from '@apollo/client'

export const LOAD_USER_EMAILS = gql`
  query {
    getAllUsers {
      email
      id
    }
  }
`

export const GET_NAME = gql`
  query {
    getUser {
      success
      message
      user {
        name
      }
      code
    }
  }
`
