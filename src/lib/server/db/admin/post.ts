import { SqliteError } from 'better-sqlite3';
import { db } from '..';

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
			query.delete.forEach(([whereValues, row]) => {
				try {
					deleteRows.run(...whereValues);
				} catch (error) {
					const pos = whereValues
						.map((value, i) => `${primaryKeys[i]}=${JSON.stringify(value.toString())}`)
						.join(', ');
					where = `Query failed during deletion of (${pos})`;
					errorRow = row;
					throw error;
				}
			});
			query.edit.forEach(([newValues, whereValues, row]) => {
				try {
					updateRows.run(
						...whereValues,
						...newValues.map((v, i) => {
							try {
								return JSON.parse(v);
							} catch (error) {
								if (error instanceof SyntaxError) {
									if (v) {
										error.message = `Unable to parse the value: ${JSON.stringify(v)} of "${columnNames[i]}"`;
									} else {
										error.message = `Missing value in "${columnNames[i]}". If it is meant to be 'null', explicitly type it.`;
									}
								}
								throw error;
							}
						})
					);
				} catch (error) {
					const pos = newValues
						.map((value, i) => `${primaryKeys[i]}=${JSON.stringify(value.toString())}`)
						.join(', ');
					where = `Query failed during updation of (${pos})`;
					errorRow = row;
					throw error;
				}
			});
			query.add.forEach((values, row) => {
				try {
					insertRows.run(
						...values.map((v, i) => {
							try {
								return JSON.parse(v);
							} catch (error) {
								if (error instanceof SyntaxError) {
									if (v) {
										error.message = `Unable to parse the value: ${JSON.stringify(v)} of "${columnNames[i]}"`;
									} else {
										error.message = `Missing value in "${columnNames[i]}". If it is meant to be 'null', explicitly type it.`;
									}
								}
								throw error;
							}
						})
					);
				} catch (error) {
					const pos = values
						.map((value, i) => `${columnNames[i]}=${JSON.stringify(value.toString())}`)
						.join(', ');
					isAdd = true;
					where = `Query failed during insertion of (${pos})`;
					errorRow = row;
					throw error;
				}
			});
		})();
	} catch (error) {
		if (error instanceof SqliteError) {
			return { error: { code: error.code, why: error.message, where, isAdd, row: errorRow! } };
		}
		if (error instanceof SyntaxError) {
			return {
				error: {
					code: 'INVALID_VALUE',
					why: error.message,
					where,
					isAdd,
					row: errorRow!
				}
			};
		}
		throw error;
	}
	return { success: true };
};
