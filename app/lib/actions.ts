'use server';

/*
 * This file is part of the project by Massimiliano Petra.
 *
 * Copyright (C) 2025 Massimiliano Petra
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import type { DbUser } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { Pool } from 'pg';
import { date } from 'zod';
import exp from 'constants';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';


/* ************************ SEED DATABASE **************************** */

export async function seedUsers(users: DbUser[]) {
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS gw_users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL
     );
   `);

  console.log(`CREATED TABLE gw_users`);

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      try {
        executeQuery(`
           INSERT INTO gw_users (name, email, password)
           VALUES ('${user.name}', '${user.email}', '${hashedPassword}')
           ON CONFLICT (id) DO NOTHING;
        `);
        return "";
      } catch (error) {
        console.log(error);
        return "";
      }
    }),
  );

  console.log(`INSERTED users`);

  return insertedUsers;
}

/* ******************** CONFIGURAZIONE CLIENT    ********************* */

const provider = process.env.DATABASE_PROVIDER; // "vercel" o "pg"
const pool = provider === 'pg' ? new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
}) : null;

export async function executeQuery<T>(query: string): Promise<T[] | undefined> {
  console.log(query);
  if (provider === 'pg') {
    if (!pool) {
      throw new Error('Pool non configurato per pg');
    }
    const client = await pool.connect();
    try {
      const res = await client.query(query);
      return res.rows;
    } finally {
      client.release();
    }
  } else {
    return (await sql.query(query)).rows;
  }
}



/* ************************ AUTHENTICATION **************************** */

export async function authenticate(prevState: string | undefined, formData: FormData,) {
  console.log("Authenticate");
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function getUser(email: string): Promise<DbUser | undefined> {
  try {
    const user = await executeQuery<DbUser>(`SELECT * FROM gw_users WHERE email='${email}'`);
    if (user)
      return user[0];
    else
      return undefined;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function addUsers(email: string, name: string, password: string) {
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS gw_users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL
     );
   `);

  console.log(`CREATED TABLE gw_users`);


    const hashedPassword = await bcrypt.hash(password, 10);

    await executeQuery(`
           INSERT INTO gw_users (name, email, password)
           VALUES ('${name}', '${email}', '${hashedPassword}');
  `);

}

/* ******************** DB TOOLS    ********************* */

export async function listTables(): Promise<any[] | undefined> {
  const result = await executeQuery(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`);
  return result;
}

export async function doSelect(tableName: string): Promise<any[] | undefined> {
  try {

    const query = `SELECT * FROM ${ tableName } `;
    console.log(query)
    const result = await executeQuery(query);
    console.log(result);
    return result;
  } catch (error) {
    console.log(`ERROR: doSelect(SELECT * FROM ${ tableName })`);
    console.log(error);
    return [];
  }
}

export async function doTruncate(tableName: string): Promise<any[] | undefined> {
  try {

    const query = `TRUNCATE TABLE ${ tableName } `;
    console.log(query)
    const result = await executeQuery(query);
    return result;
  } catch (error) {
    return [];
  }
}

export async function doDrop(tableName: string): Promise<any[] | undefined> {
  try {

    const query = `DROP TABLE ${ tableName } `;
    console.log(query)
    const result = await executeQuery(query);
    return result;
  } catch (error) {
    return [];
  }
}
