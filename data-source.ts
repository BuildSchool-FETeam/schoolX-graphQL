import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USER_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Toan1234',
  database: process.env.DB_NAME || 'prisdom',
  migrations: ['src/migrations/*.ts'],
  entities: ['dist/**/*.entity.js'],
})
