const db = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateAccessToken, generateRefreshToken } = require('../helpers')
const {
  AuthenticationError,
  ApolloError,
  ForbiddenError,
} = require('apollo-server-express')
const { DatabaseError } = require('pg')

const resolvers = {
  Query: {
    async getAllUsers(_parent, _args, context) {
      try {
        if (!context.id) {
          throw AuthenticationError
        }
        const usersResponse = await db.query('SELECT * FROM users')
        return usersResponse.rows
      } catch {
        return []
      }
    },

    async getUser(_parent, _args, context) {
      try {
        if (!context.id) {
          throw AuthenticationError
        }

        const userResponse = await db.query(
          'SELECT * FROM users WHERE id = $1',
          [context.id],
        )

        if (userResponse.rows.length === 0) {
          throw ApolloError
        }

        return {
          success: true,
          message: 'User found',
          user: userResponse.rows[0],
        }
      } catch (e) {
        return {
          success: false,
          message:
            e === AuthenticationError
              ? 'Authentication error'
              : 'Unexpected error',
          code: 403,
        }
      }
    },
  },
  Mutation: {
    async createUser(_, { name, email, password }) {
      try {
        const passhash = await bcrypt.hash(password, 10)

        await db.query(
          'INSERT INTO users (name, email, passhash) VALUES($1, $2, $3)',
          [name, email, passhash],
        )
        return { success: true, message: 'User successfully created' }
      } catch (e) {
        if (e.code === '23505') {
          return {
            success: false,
            message: 'User already exists with this email',
          }
        }
        return { success: false, message: 'An error has occurred' }
      }
    },

    async signIn(_parent, { email, password }) {
      try {
        const userQuery = await db.query(
          'SELECT email, passhash, id FROM users WHERE email = $1',
          [email],
        )

        const incorrectResponse = {
          success: false,
          message: 'Email or password is incorrect',
          accessToken: '',
          refreshToken: '',
        }

        if (userQuery.rows.length === 0) {
          return incorrectResponse
        }

        const { passhash, id } = userQuery.rows[0]

        const passwordIsCorrect = await bcrypt.compare(password, passhash)

        if (!passwordIsCorrect) {
          return incorrectResponse
        }

        const accessToken = generateAccessToken(id)
        const refreshToken = generateRefreshToken(id)

        await db.query('INSERT INTO refresh_tokens (token) VALUES($1);', [
          refreshToken,
        ])

        return {
          success: true,
          message: 'User logged in',
          accessToken,
          refreshToken,
        }
      } catch {
        return {
          success: false,
          message: 'An error has occurred',
          accessToken: '',
          refreshToken: '',
        }
      }
    },

    async generateNewToken(_parent, { refreshToken }) {
      if (!refreshToken) {
        return {
          success: false,
          message: 'Refresh token not provided',
          code: 401,
        }
      }

      try {
        const tokenQuery = await db.query(
          'SELECT * FROM refresh_tokens WHERE token = $1',
          [refreshToken],
        )

        if (tokenQuery.rowCount === 0) {
          throw ForbiddenError
        }

        const { token } = tokenQuery.rows[0]
        const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

        const accessToken = generateAccessToken(user.id)
        return {
          success: true,
          message: 'Access token created',
          accessToken,
        }
      } catch (e) {
        if (e === ForbiddenError) {
          return {
            success: false,
            message: 'Refresh token not valid',
            code: 403,
          }
        }

        return {
          success: false,
          message: 'An unexpected error has occurred',
          code: 500,
        }
      }
    },
  },
}

module.exports = resolvers
