import { DB_PATH } from '$env/static/private';
import Database from 'better-sqlite3';
export const db = new Database(DB_PATH);
// export const db = new Database(DB_PATH, { verbose: console.log });
