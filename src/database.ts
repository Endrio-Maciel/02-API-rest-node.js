import { knex as setupKnex, Knex } from "knex";
import { env } from './env'

if (!process.env.DATABASE_URL){
    throw new Error('DATABASE_URL ENV NOT FOUND.')
}

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT.trim() == 'sqlite'
     ? {
        filename: env.DATABASE_URL,
    } : env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    }

}

export const knex = setupKnex(config)
