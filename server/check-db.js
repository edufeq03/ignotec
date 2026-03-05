import initSqlJs from 'sql.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'ignotec.db');

async function checkDb() {
    try {
        const SQL = await initSqlJs();
        const buffer = readFileSync(DB_PATH);
        const db = new SQL.Database(buffer);

        const count = db.exec('SELECT COUNT(*) FROM users')[0].values[0][0];
        console.log(`Number of users in DB: ${count}`);

        if (count > 0) {
            const users = db.exec('SELECT * FROM users')[0].values;
            console.log('Users:', users);
        }
    } catch (err) {
        console.error('Error checking DB:', err.message);
    }
}

checkDb();
