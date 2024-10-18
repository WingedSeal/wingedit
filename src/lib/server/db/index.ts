import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
export const db = new Database(DB_PATH);
// export const db = new Database(DB_PATH, { verbose: console.log });
