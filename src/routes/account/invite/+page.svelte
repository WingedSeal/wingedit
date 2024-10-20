<script lang="ts">
	import { enhance as svelteEnhance } from '$app/forms';
	import { page } from '$app/stores';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { superForm } from 'sveltekit-superforms';
	export let data;
	const { form, errors, message, enhance: superEnhance } = superForm(data.form);
	$: if ($message?.code) {
		navigator.clipboard.writeText($page.url.origin + '/account/signup?code=' + $message?.code);
	}
</script>

INVITE

<form method="post" use:superEnhance class="flex m-5 flex-col" action="?/new">
	<select name="privilege" id="privilege" bind:value={$form.privilege}>
		<option selected hidden value={-2} />
		{#each Object.values(data.privileges) as privilege}
			<option value={privilege.Privilege}>{privilege.RoleName}</option>
		{/each}
	</select>
	<small>
		{#if $errors.privilege}
			{$errors.privilege[0]}
		{/if}
	</small>
	<button type="submit">GET</button>
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
		</tr>
	{/each}
</table>

<style lang="css">
	table,
	th,
	td {
		border: 1px solid;
	}
</style>
