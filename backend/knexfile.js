require('dotenv').config({path : `${__dirname}/.env`})

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'postgres',
      user: 'postgres',
      password: '1234'
    },
    migrations : {
      tableName: 'knex_migrations',
      directory: `${__dirname}/api/database/migrations`
    },
    seeds: {
      directory: `${__dirname}/api/database/seeds`
    }
  }

};

