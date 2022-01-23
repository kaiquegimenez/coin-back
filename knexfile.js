module.exports = {

  development: {
    client: 'pg',
    connection: {
      connectionString: 'postgres://yntoaqkpvnmnqt:b3c5924bb951be3d29d54a477f7d68f2bb74347ea80cc51b3a227d9bee7221b8@ec2-3-212-143-188.compute-1.amazonaws.com:5432/d4jmitrdkgq9h4',
      ssl: { rejectUnauthorized: false }
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

