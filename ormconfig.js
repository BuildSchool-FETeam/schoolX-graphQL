module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Toan1234',
  database: process.env.DB_NAME || 'schoolX-dev',
  entities: ['dist/**/*.entity.js'],
  autoLoadEntities: true,
  migrationsTableName: 'migration_table_dev',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
