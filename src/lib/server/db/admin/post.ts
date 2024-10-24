import { db } from '..';
import { SqliteError } from 'better-sqlite3';

type ColumnName = string;
type RowValue = string[];
type PrimaryKeyName = ColumnName;
type PrimaryKeyValue = RowValue;

export const executeQuery = (
	tableName: string,
	primaryKeys: PrimaryKeyName[],
	columnNames: ColumnName[],
	query: {
		delete: [PrimaryKeyValue, number][];
		add: RowValue[];
		edit: [PrimaryKeyValue, RowValue, number][];
	}
): {
	error?: {
		code: string;
		why: string;
		where: string;
		isAdd: boolean;
		row: number;
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
	let isAdd = false;
	let errorRow: number;
	try {
		db.transaction(() => {
			query.delete.forEach(([values, row]) => {
				try {
					deleteRows.run(...values);
				} catch (error) {
					const pos = values.map((value, i) => `${primaryKeys[i]}="${value}"`).join(', ');
					where = `Query failed during deletion of (${pos})`;
					errorRow = row;
					throw error;
				}
			});
			query.edit.forEach(([keyValues, values, row]) => {
				try {
					updateRows.run(...values, ...keyValues);
				} catch (error) {
					const pos = keyValues.map((value, i) => `${primaryKeys[i]}="${value}"`).join(', ');
					where = `Query failed during updation of (${pos})`;
					errorRow = row;
					throw error;
				}
			});
			query.add.forEach((values, row) => {
				try {
					insertRows.run(...values);
				} catch (error) {
					const pos = values.map((value, i) => `${columnNames[i]}="${value}"`).join(', ');
					isAdd = true;
					where = `Query failed during insertion of (${pos})`;
					errorRow = row;
					throw error;
				}
			});
		})();
	} catch (error) {
		if (!(error instanceof SqliteError)) {
			throw error;
		}
		return { error: { code: error.code, why: error.message, where, isAdd, row: errorRow! } };
	}
	return { success: true };
};
