const { knexSnakeCaseMappers } = require("objection");
require("dotenv/config");

const knexConfig = {
  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
    ...knexSnakeCaseMappers(),
  },
  development: {
    client: "postgres",
    connection: {
      host: "localhost",
      port: 5432,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
    ...knexSnakeCaseMappers(),
  },

  staging: {
    client: "postgres",
    connection: {
      host: "localhost",
      port: 5432,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
    ...knexSnakeCaseMappers(),
  },

};

module.exports = knexConfig;

export default {
  knexConfig
}
