<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { enhance } from '$app/forms';
	export let data;
	export let form;
	let formElement: HTMLFormElement;
	type PK = number[];
	type DatabaseObject = string[];
	let query: {
		delete: Set<number>;
		add: string[][];
		edit: Set<number>;
	} = {
		delete: new Set(),
		add: [],
		edit: new Set()
	};
	const getPK = (row: number): PK => {
		if (!form || !form.primaryKeys) throw Error('form is null');
		return form.primaryKeys.map((key) => {
			return form.table[row][key];
		});
	};
	const getDatabaseObject = (row: number): DatabaseObject => {
		if (!form) throw Error('form is null');
		return Object.keys(form.table[0]).map((_, col) => {
			const input = document.getElementById(`${row}-${col}`) as HTMLInputElement;
			if (!input) throw Error('Missing input');
			return input.value;
		});
	};
	const addNewRow = () => {
		if (!form) throw Error('form is null');
		let isSomething = false;
		const newRow = Object.keys(form.table[0]).map((_, col) => {
			const input = document.getElementById(`add-${col}`) as HTMLInputElement;
			if (!input) throw Error('Missing input');
			const value = input.value;
			if (value) isSomething = true;
			input.value = '';
			return value;
		});
		if (isSomething) query.add.push(newRow);
	};
	let save: {
		error?: {
			code: string;
			why: string;
			where: string;
			isAdd: boolean;
			row: number;
		};
		success?: boolean;
	} | null = null;
	const confirm = async () => {
		const response = await fetch('/api/database', {
			method: 'POST',
			body: JSON.stringify({
				tableName: form!.tableName,
				primaryKeys: form!.primaryKeys!,
				columnNames: Object.keys(form?.table[0]),
				query: {
					delete: [...query.delete].map((row) => [getPK(row), row]),
					add: query.add,
					edit: [...query.edit].map((row) => [getPK(row), getDatabaseObject(row), row])
				}
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		save = await response.json();
		if (save!.success) {
			formElement.submit();
		}
	};
	let isFetching = false;
	let tableSQL: string = '';
	const fetchSQL = async () => {
		if (isFetching) return;
		isFetching = true;
		const response = await fetch('/api/database?tableName=' + form?.tableName);
		if (!response.ok) {
			isFetching = false;
			throw new Error(`Response status: ${response.status}`);
		}
		tableSQL = await response.json();
		isFetching = false;
	};
</script>

{#if save && save.error}
	<p class="text-red-500">Code: {save.error?.code}</p>
	<p class="text-red-500">{save.error?.where}</p>
	<p class="text-red-500">{save.error?.why}</p>
{/if}
<form bind:this={formElement} method="post" use:enhance>
	<label for="tableName">Table:</label>
	<select name="tableName" on:change={() => formElement.submit()} value={form?.tableName}>
		<option selected hidden />
		{#each data.tables as tableName}
			<option value={tableName}>{tableName}</option>
		{/each}
	</select>
</form>

<button on:click={() => formElement.submit()}>REFRESH</button>

<br />
<button on:click={fetchSQL}>DUMP</button>
<br />
{#if isFetching}
	FETCHING...
{/if}
<br />
{#if tableSQL}
	SQL READY:
	<br />
	<button on:click={() => navigator.clipboard.writeText(tableSQL)}>COPY</button>
{/if}

{#if form && form.table}
	{#if form.table.length !== 0}
		<table>
			<tr>
				{#each Object.keys(form.table[0]) as colName}
					<th>{colName}</th>
				{/each}
				<th></th>
			</tr>
			{#each form.table as row, rowIndex}
				<tr
					class={(query.delete.has(rowIndex) ? 'bg-red-400' : '') +
						(query.edit.has(rowIndex) ? 'bg-green-300' : '') +
						(save?.error?.row == rowIndex && !save.error.isAdd ? ' bg-red-900' : '')}
				>
					{#each Object.values(row) as colValue, colIndex}
						<td>
							{#if query.edit.has(rowIndex)}
								<input
									class="bg-transparent"
									type="text"
									value={colValue}
									id={`${rowIndex}-${colIndex}`}
								/>
							{:else}
								{colValue}
							{/if}
						</td>
					{/each}
					<td>
						<button
							type="button"
							on:click={() => {
								save = null;
								if (query.edit.has(rowIndex)) query.edit.delete(rowIndex);
								else {
									query.edit.add(rowIndex);
									query.delete.delete(rowIndex);
								}
								query.edit = query.edit;
							}}
						>
							<i class="fa-solid fa-pen-to-square mx-2" />
						</button>
					</td>
					<td>
						<button
							type="button"
							on:click={() => {
								save = null;
								if (query.delete.has(rowIndex)) query.delete.delete(rowIndex);
								else {
									query.delete.add(rowIndex);
									query.edit.delete(rowIndex);
								}
								query.delete = query.delete;
							}}
						>
							<i class="fa-solid fa-trash mx-2" />
						</button>
					</td>
				</tr>
			{/each}
			{#each query.add as newRow, newRowIndex}
				<tr
					class={'bg-blue-100' +
						(save?.error?.row == newRowIndex && save.error.isAdd ? '  bg-red-900' : '')}
				>
					{#each newRow as colValue}
						<td>
							{colValue}
						</td>
					{/each}
					<td>
						<button
							type="button"
							on:click={() => {
								save = null;
								Object.keys(form.table[0]).forEach((_, i) => {
									// @ts-ignore: Assuming element exists and has a value property
									document.getElementById(`add-${i}`).value = query.add[newRowIndex][i];
								});
								query.add.splice(newRowIndex, 1);
								query.add = query.add;
							}}
						>
							E
						</button>
					</td>
					<td>
						<button
							type="button"
							on:click={() => {
								save = null;
								query.add.splice(newRowIndex, 1);
								query.add = query.add;
							}}
						>
							<i class="fa-solid fa-trash mx-2" />
						</button>
					</td>
				</tr>
			{/each}
			<tr>
				{#each Object.keys(form.table[0]) as _, col}
					<td><input type="text" id={`add-${col}`} /></td>
				{/each}
				<td colspan="2"
					><button
						type="button"
						on:click={() => {
							save = null;
							addNewRow();
							query.add = query.add;
						}}>ADD</button
					></td
				>
			</tr>
		</table>
		<button on:click={confirm}>Save</button>
	{:else}
		EMPTY TABLE
	{/if}
{/if}

<style lang="css">
	table,
	th,
	td {
		border: 1px solid;
	}
</style>
