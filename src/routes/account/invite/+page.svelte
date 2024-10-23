<script lang="ts">
	import { enhance as svelteEnhance } from '$app/forms';
	import { page } from '$app/stores';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { inviteSchema as schema } from '$lib/schema';
	export let data;
	const {
		form,
		errors,
		message,
		enhance: superEnhance
	} = superForm(data.form, {
		validators: zodClient(schema)
	});
	const copyCode = (code: string) => {
		return navigator.clipboard.writeText($page.url.origin + '/account/signup?code=' + code);
	};
	$: if ($message?.code) {
		copyCode($message?.code);
	}
	if (data.canHideSource) {
		$form.isHideSource = true;
	}
</script>

INVITE
<form method="post" use:superEnhance class="flex m-5 flex-col" action="?/new">
	<select name="privilege" id="privilege" bind:value={$form.privilege}>
		{#each Object.values(data.privileges) as privilege}
			{#if data.user?.privilege && privilege.Privilege <= data.user?.privilege}
				<option value={privilege.Privilege}>{privilege.RoleName}</option>
			{/if}
		{/each}
	</select>
	<small>
		{#if $errors.privilege}
			{$errors.privilege[0]}
		{/if}
	</small>
	<div hidden={!data.canHideSource}>
		<label for="isHideSource">Hide that this invite is from you</label>
		<input
			type="checkbox"
			id="isHideSource"
			name="isHideSource"
			bind:checked={$form.isHideSource}
			disabled={!data.canHideSource}
		/>
	</div>
	<button type="submit">Create Invite</button>
</form>

{#if $message}
	{$message.message}<br />
	{$message?.code} <br />
	Invite link copied
{/if}

<br />
<table>
	<tr>
		<th> Code </th>
		<th> Privilege </th>
		<th></th>
		<th></th>
	</tr>
	{#each data.codes as code}
		<tr>
			<td>
				{code.Code}
			</td>
			<td>
				{data.privileges[code.Privilege]?.RoleName ?? code.Privilege}
			</td>
			<td>
				<form action="?/del" method="post" use:svelteEnhance>
					<button type="submit" value={code.Code} name="code">
						<i class="fa-solid fa-trash mx-2" />
					</button>
				</form>
			</td>
			<td>
				<button type="button" on:click={() => copyCode(code.Code)}>
					<i class="fa-solid fa-copy mx-2" />
				</button>
			</td>
		</tr>
	{/each}
</table>

<br />
{#if data.hiddenCodes}
	HIDDEN CODES
	<table>
		<tr>
			<th> Code </th>
			<th> Privilege </th>
			<th></th>
			<th></th>
		</tr>
		{#each data.hiddenCodes as code}
			<tr>
				<td>
					{code.Code}
				</td>
				<td>
					{data.privileges[code.Privilege]?.RoleName ?? code.Privilege}
				</td>
				<td>
					<form action="?/del" method="post" use:svelteEnhance>
						<button type="submit" value={code.Code} name="code">
							<i class="fa-solid fa-trash mx-2" />
						</button>
					</form>
				</td>
				<td>
					<button type="button" on:click={() => copyCode(code.Code)}>
						<i class="fa-solid fa-copy mx-2" />
					</button>
				</td>
			</tr>
		{/each}
	</table>
{/if}

<style lang="css">
	table,
	th,
	td {
		border: 1px solid;
	}
</style>
