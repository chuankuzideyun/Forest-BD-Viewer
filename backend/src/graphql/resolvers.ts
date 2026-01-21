import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppDataSource } from "../datasource"
import { User } from "../entity/User"
import { Forest } from "../entity/Forest"

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: any) => ctx.user,
    forests: async (_: unknown, { bbox }: any, ctx: any) => {
      if (!ctx.user) {
        throw new Error("unauthorized")
      }
      const [minX, minY, maxX, maxY] = bbox
      return AppDataSource.getRepository(Forest)
        .createQueryBuilder("f")
        .where(
          "ST_Intersects(f.geom, ST_MakeEnvelope(:minX,:minY,:maxX,:maxY,4326))",
          { minX, minY, maxX, maxY }
        )
        .getMany()
    }
  },

  Mutation: {
    register: async (_: any, { email, password }: any) => {
      const repo = AppDataSource.getRepository(User)
      const hashed = await bcrypt.hash(password, 10)
      await repo.save({ email, password: hashed })
      return true
    },

    login: async (_: any, { email, password }: any) => {
      const user = await AppDataSource.getRepository(User).findOneBy({ email })
      if (!user) throw new Error("invalid")
      const ok = await bcrypt.compare(password, user.password)
      if (!ok) throw new Error("invalid")
      return jwt.sign({ id: user.id }, "secret")
    },

    saveMapState: async (_: any, { state }: any, ctx: any) => {
      if (!ctx.user) {
        throw new Error("unauthorized")
      }
      ctx.user.lastMapState = state
      await AppDataSource.getRepository(User).save(ctx.user)
      return true
    }
  }
}
