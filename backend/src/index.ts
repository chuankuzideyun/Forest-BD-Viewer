import "reflect-metadata"
import express from "express"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import jwt from "jsonwebtoken"
import { typeDefs } from "./graphql/schema"
import { resolvers } from "./graphql/resolvers"
import { AppDataSource } from "./datasource"
import { User } from "./entity/User"

// Note: loosen typing here to avoid express type conflicts inside docker build
// when apollo-server-express brings its own express types.
const app: any = express()
app.use(cors())

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: async ({ req }) => {
    const token = req.headers.authorization
    if (!token) return {}
    try {
      const payload: any = jwt.verify(token, "secret")
      const user = await AppDataSource.getRepository(User).findOneBy({ id: payload.id })
      return { user }
    } catch {
      return {}
    }
  }
})

async function start() {
  await AppDataSource.initialize()
  await server.start()
  server.applyMiddleware({ app, path: "/graphql" })
  app.listen(4000, "0.0.0.0", () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

start()
