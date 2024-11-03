<script lang="ts">
	import { enhance as svelteEnhance } from '$app/forms';
	import { page } from '$app/stores';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { inviteSchema as schema } from '$lib/schema';
	const { data } = $props();
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
	$effect(() => {
		if ($message?.code) {
			copyCode($message?.code);
		}
	});
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
	<thead>
		<tr>
			<th> Code </th>
			<th> Privilege </th>
			<th></th>
			<th></th>
		</tr>
	</thead>
	<tbody>
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
						<button type="submit" value={code.Code} name="code" aria-label="delete code">
							<i class="fa-solid fa-trash mx-2"></i>
						</button>
					</form>
				</td>
				<td>
					<button type="button" onclick={() => copyCode(code.Code)} aria-label="copy code">
						<i class="fa-solid fa-copy mx-2"></i>
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<br />
{#if data.hiddenCodes}
	HIDDEN CODES
	<table>
		<thead>
			<tr>
				<th>Code</th>
				<th>Privilege</th>
				<th></th>
				<th></th>
			</tr>
		</thead>
		<tbody>
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
							<button type="submit" value={code.Code} name="code" aria-label="delete code">
								<i class="fa-solid fa-trash mx-2"></i>
							</button>
						</form>
					</td>
					<td>
						<button type="button" onclick={() => copyCode(code.Code)} aria-label="copy code">
							<i class="fa-solid fa-copy mx-2"></i>
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style lang="css">
	table,
	th,
	td {
		border: 1px solid;
	}
</style>
