<script lang="ts">
	import { enhance } from '$app/forms';
	export let data;
	export let form;
	let formElement: HTMLFormElement;
</script>

<form action="?/getTable" bind:this={formElement} method="post" use:enhance>
	<label for="tableName">Table:</label>
	<select name="tableName" on:change={() => formElement.submit()} value={form?.tableName}>
		<option selected hidden />
		{#each data.tables as tableName}
			<option value={tableName}>{tableName}</option>
		{/each}
	</select>
</form>

{#if form && form.table}
	{#if form.table.length !== 0}
		<table>
			<tr>
				{#each Object.keys(form.table[0]) as colName}
					<th>{colName}</th>
				{/each}
				<th></th>
			</tr>
			{#each form.table as row}
				<tr>
					{#each Object.values(row) as col}
						<td>{col}</td>
					{/each}
					<td><button>EDIT BUTTON SOON TM</button></td>
				</tr>
			{/each}
		</table>
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
