'use client'

import { useState, useEffect } from 'react';
import { doSelect, doTruncate, doDrop, listTables, executeQuery} from '@/app/lib/actions';

/* ************************ SEED DATABASE **************************** */

export async function seedUsers() {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
         id INTEGER PRIMARY KEY,
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
             INSERT INTO gw_users (id, name, email, password)
             VALUES (${user.id}, '${user.name}', '${user.email}', '${hashedPassword}')
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

export async function seedDatabase() {

    try {
        console.log('**** Database seeding ****');
        await seedUsers();

        console.log('Database seed completed');
    } catch (error) {

    }

}

export default function Page() {

    const [phase, setPhase] = useState('iniziale');
    const [result, setResult] = useState<any>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState('');

    useEffect(() => {
        // Recupera i dati e aggiornali nello stato
        fetchData();
    }, []);

    async function fetchData() {
        const result = await listTables();
        console.log(result);
        if (result) {
            setOptions(result.map((item) => { return item.table_name }))
        }
    }

    return (
        <p> "Ciao"  </p>
    );
}