require('dotenv').config()
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const typeDefs = require('./schema/typeDefs')
const resolvers = require('./schema/resolvers')
const express = require('express')
const app = express()

const main = async () => {
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  }

  const server = new ApolloServer({
    context({ req }) {
      const ctx = { id: null }
      try {
        if (req.headers['x-access-token']) {
          console.log(req.headers['x-access-token'])
          const token = jwt.verify(
            req.headers['x-access-token'],
            process.env.ACCESS_TOKEN_SECRET,
          )

          ctx.id = token.id
          return ctx
        }
      } catch (e) {
        return ctx
      }
    },
    typeDefs,
    resolvers,
    cors: corsOptions,
  })
  await server.start()
  server.applyMiddleware({ app })

  app.listen(4000, () => console.log('Server running on port 4000'))
}

main()
