import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Forest } from "./entity/Forest"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "forest",
  synchronize: true,
  entities: [User, Forest],
  logging: false
})

