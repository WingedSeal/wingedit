import Database, { SqliteError } from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
export const db = new Database(DB_PATH);
// export const db = new Database(DB_PATH, { verbose: console.log });

export const getTables = () => {
	let tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all() as {
		name: string;
	}[];
	return tables.map((table) => table.name);
};

export const getPrimaryKeys = (tableName: string) => {
	if (!tableName.match(/^[a-zA-Z0-9]+$/i)) return null;
	const keys = db
		.prepare(`SELECT name FROM pragma_table_info('${tableName}') WHERE pk >= 1;`)
		.all() as { name: string }[];

	return keys.map((key) => key.name);
};

export const getTable = (tableName: string) => {
	if (!tableName.match(/^[a-zA-Z0-9]+$/i)) return null;
	try {
		return db.prepare(`SELECT * FROM ${tableName} LIMIT 100;`).all() as any[];
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return null;
	}
};

type ColumnName = string;
type RowValue = string[];
type PrimaryKeyName = ColumnName;
type PrimaryKeyValue = RowValue;

export const executeQuery = (
	tableName: string,
	primaryKeys: PrimaryKeyName[],
	columnNames: ColumnName[],
	query: {
		delete: PrimaryKeyValue[];
		add: RowValue[];
		edit: [PrimaryKeyValue, RowValue][];
	}
): {
	error?: {
		code: string;
		why: string;
		where: string;
	};
	success?: boolean;
} | null => {
	if (!tableName.match(/^[a-zA-Z0-9]+$/i)) return null;
	const condition = primaryKeys.map((key) => `"${key}"=?`).join(' AND ');

	const deleteRows = db.prepare(`
		DELETE FROM 
			${tableName} 
		WHERE 
			${condition};`);
	const set = columnNames.map((col) => `"${col}"=?`).join(', ');
	const updateRows = db.prepare(`
		UPDATE 
			${tableName}
		SET 
			${set}
		WHERE
			${condition};`);
	const into = columnNames.join(', ');
	const values = columnNames.map(() => `?`).join(', ');
	const insertRows = db.prepare(`
		INSERT INTO
			${tableName} (${into})
		VALUES
			(${values});`);
	let where: string = '';
	try {
		db.transaction(() => {
			query.delete.forEach((values) => {
				try {
					deleteRows.run(...values);
				} catch (error) {
					const pos = values.map((value, i) => `${primaryKeys[i]}="${value}"`).join(', ');
					where = `Query failed during deletion of (${pos})`;
					throw error;
				}
			});
			query.edit.forEach(([keyValues, values]) => {
				try {
					updateRows.run(...values, ...keyValues);
				} catch (error) {
					const pos = keyValues.map((value, i) => `${primaryKeys[i]}="${value}"`).join(', ');
					where = `Query failed during updation of (${pos})`;
					throw error;
				}
			});
			query.add.forEach((values) => {
				try {
					insertRows.run(...values);
				} catch (error) {
					const pos = values.map((value, i) => `${columnNames[i]}="${value}"`).join(', ');
					where = `Query failed during insertion of (${pos})`;
					throw error;
				}
			});
		})();
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return { error: { code: error.code, why: error.message, where } };
	}
	return { success: true };
};
