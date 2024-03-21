import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

export const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: env.DATABASE_MIGRATIONS,
    loadExtensions: ['.ts'],
  },
};

export const knex = setupKnex(knexConfig);
