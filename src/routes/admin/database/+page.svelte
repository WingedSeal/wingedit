<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { afterNavigate, goto } from '$app/navigation';
	import { writable, type Writable } from 'svelte/store';
	let { form, data } = $props();
	let formElement: HTMLFormElement;
	type PK = number[];
	type DatabaseObject = string[];
	let query: Writable<{
		delete: Set<number>;
		add: string[][];
		edit: Set<number>;
	}> = writable({
		delete: new Set(),
		add: [],
		edit: new Set()
	});
	const tableParam = 'table';
	const getPK = (row: number): PK => {
		if (!form || !form.primaryKeys) throw Error('form is null');
		return form.primaryKeys.map((key) => {
			return form.table[row][key] as number;
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

	const STOP_ITERATION = new Error();
	const addNewRow = () => {
		if (!form) throw Error('form is null');
		missingValueCol = null;
		let newRow;
		try {
			newRow = Object.keys(form.table[0]).map((_, col) => {
				const input = document.getElementById(`add-${col}`) as HTMLInputElement;
				if (!input) throw Error(`Missing input element: ${col}`);
				const value = input.value;
				if (!value) {
					missingValueCol = col;
					throw STOP_ITERATION;
				}
				input.value = '';
				return value;
			});
		} catch (error) {
			if (error !== STOP_ITERATION) throw error;
		}
		if (newRow) $query.add.push(newRow);
	};
	let save = $state<{
		error?: {
			code: string;
			why: string;
			where: string;
			isAdd: boolean;
			row: number;
		};
		success?: boolean;
	} | null>(null);
	const confirm = async () => {
		const response = await fetch('/api/database', {
			method: 'POST',
			body: JSON.stringify({
				tableName: form!.tableName,
				primaryKeys: form!.primaryKeys!,
				columnNames: Object.keys(form!.table[0]),
				query: {
					delete: [...$query.delete].map((row) => [getPK(row), row]),
					add: $query.add,
					edit: [...$query.edit].map((row) => [getPK(row), getDatabaseObject(row), row])
				}
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		save = await response.json();
		if (save!.success) {
			formElement.requestSubmit();
		}
	};
	let isFetching = $state(false);
	let tableSQL = $state('');
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
	let missingValueCol = $state<number | null>(null);
	let customError = $state('');
	afterNavigate(() => formElement.requestSubmit());
</script>

{#if save && save.error}
	<p class="text-red-500">Code: {save.error?.code}</p>
	<p class="text-red-500">{save.error?.where}</p>
	<p class="text-red-500">{save.error?.why}</p>
{/if}
{#if customError}
	<p class="text-red-500">{customError}</p>
{/if}
<form
	bind:this={formElement}
	method="post"
	use:enhance={() => {
		return async ({ update }) => {
			update({ reset: false });
		};
	}}
>
	<label for="tableName">Table:</label>
	<select
		name="tableName"
		onchange={(event) => {
			let query = new URLSearchParams($page.url.searchParams.toString());
			query.set(tableParam, (event.target as HTMLSelectElement).value);
			goto(`?${query.toString()}`);
			formElement.requestSubmit();
		}}
		value={form?.tableName ?? $page.url.searchParams.get(tableParam)}
	>
		<option selected hidden></option>
		{#each data.tables as tableName}
			<option value={tableName}>{tableName}</option>
		{/each}
	</select>
</form>

<button onclick={() => formElement.requestSubmit()}>REFRESH</button>

<br />
<button onclick={fetchSQL}>DUMP</button>
<br />
{#if isFetching}
	FETCHING...
{/if}
<br />
{#if tableSQL}
	SQL READY:
	<br />
	<button onclick={() => navigator.clipboard.writeText(tableSQL)}>COPY</button>
{/if}

{#if form && form.table}
	{#if form.table.length !== 0}
		<table>
			<thead>
				<tr>
					{#each Object.keys(form.table[0]) as colName}
						<th>{colName}</th>
					{/each}
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each form.table as row, rowIndex}
					<tr
						class={($query.delete.has(rowIndex) ? 'bg-red-400' : '') +
							($query.edit.has(rowIndex) ? 'bg-green-300' : '') +
							(save?.error?.row === rowIndex && !save.error.isAdd ? ' bg-red-900' : '')}
					>
						{#each Object.values(row) as colValue, colIndex}
							<td>
								{#if $query.edit.has(rowIndex)}
									<input
										class="bg-transparent"
										type="text"
										value={JSON.stringify(colValue)}
										id={`${rowIndex}-${colIndex}`}
									/>
								{:else}
									{JSON.stringify(colValue)}
								{/if}
							</td>
						{/each}
						<td>
							<button
								type="button"
								onclick={() => {
									save = null;
									if ($query.edit.has(rowIndex)) $query.edit.delete(rowIndex);
									else {
										$query.edit.add(rowIndex);
										$query.delete.delete(rowIndex);
									}
									$query.edit = $query.edit;
								}}
								aria-label="edit"
							>
								<i class="fa-solid fa-pen-to-square mx-2"></i>
							</button>
						</td>
						<td>
							<button
								type="button"
								onclick={() => {
									save = null;
									if ($query.delete.has(rowIndex)) $query.delete.delete(rowIndex);
									else {
										$query.delete.add(rowIndex);
										$query.edit.delete(rowIndex);
									}
									$query.delete = $query.delete;
								}}
								aria-label="delete"
							>
								<i class="fa-solid fa-trash mx-2"></i>
							</button>
						</td>
					</tr>
				{/each}
				{#each $query.add as newRow, newRowIndex}
					<tr
						class={'bg-blue-100' +
							(save?.error?.row === newRowIndex && save.error.isAdd ? '  bg-red-900' : '')}
					>
						{#each newRow as colValue}
							<td>
								{colValue}
							</td>
						{/each}
						<td>
							<button
								type="button"
								onclick={() => {
									save = null;
									Object.keys(form.table[0]).forEach((_, i) => {
										(document.getElementById(`add-${i}`) as HTMLInputElement).value =
											$query.add[newRowIndex][i];
									});
									$query.add.splice(newRowIndex, 1);
									$query.add = $query.add;
								}}
							>
								E
							</button>
						</td>
						<td>
							<button
								type="button"
								onclick={() => {
									save = null;
									$query.add.splice(newRowIndex, 1);
									$query.add = $query.add;
								}}
								aria-label="add"
							>
								<i class="fa-solid fa-trash mx-2"></i>
							</button>
						</td>
					</tr>
				{/each}
				<tr>
					{#each Object.keys(form.table[0]) as _, col}
						<td class:bg-red-900={missingValueCol === col}>
							<input class="bg-transparent" type="text" id={`add-${col}`} />
						</td>
					{/each}
					<td colspan="2"
						><button
							type="button"
							onclick={() => {
								save = null;
								addNewRow();
								if (missingValueCol === null) {
									customError = '';
								} else {
									customError = `Missing value in column "${Object.keys(form.table[0])[missingValueCol]}". If it is meant to be 'null', explicity type it.`;
								}
								$query.add = $query.add;
							}}>ADD</button
						></td
					>
				</tr>
			</tbody>
		</table>
		<button onclick={confirm}>Save</button>
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
