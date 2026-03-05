import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'ignotec.db');

async function wipeDb() {
    try {
        const SQL = await initSqlJs();
        const buffer = readFileSync(DB_PATH);
        const db = new SQL.Database(buffer);

        db.run('DELETE FROM users;');
        writeFileSync(DB_PATH, Buffer.from(db.export()));
        console.log('Users wiped from DB');
    } catch (err) {
        console.error('Error wiping DB:', err.message);
    }
}

wipeDb();
