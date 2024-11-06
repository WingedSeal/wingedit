<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { agentSchema as schema, DEFAULT_ABILITY_COUNT } from '$lib/schema';
	import { writable } from 'svelte/store';

	let { data } = $props();
	const { form, errors, enhance, message } = superForm(data.form, {
		validators: zodClient(schema),
		validationMethod: 'auto',
		dataType: 'json'
	});

	const updateFormAbilities = (_abilityCount: number) => {
		$form.abilities.length = _abilityCount;
		for (let i = 0; i < _abilityCount; i++) {
			$form.abilities[i] ??= { abilityName: '', abilityNameID: '' };
		}
	};
	updateFormAbilities(DEFAULT_ABILITY_COUNT);
	const abilityCount = writable(DEFAULT_ABILITY_COUNT);
	abilityCount.subscribe(updateFormAbilities);

	if (!$form.agentID) $form.agentID = data.lastAgentId + 1;
</script>

{#if $message}
	{$message}
{/if}
<form class="flex flex-col w-1/2 p-10" method="post" use:enhance>
	<label for="agentID">Agent ID</label>
	<input type="number" id="agentID" bind:value={$form.agentID} />
	{#if $errors.agentID}
		<small>{$errors.agentID[0]}</small>
	{/if}
	<label for="agentName">Agent Name</label>
	<input type="text" name="agentName" bind:value={$form.agentName} />
	{#if $errors.agentName}
		<small>{$errors.agentName[0]}</small>
	{/if}
	<label for="agentRole">Agent Role</label>
	<select name="agentRole" bind:value={$form.agentRole}>
		{#if data.agentRoles}
			<option hidden selected></option>
			{#each data.agentRoles as agentRole}
				<option value={agentRole.RoleID}>{agentRole.Name}</option>
			{/each}
		{:else}
			<option selected></option>
		{/if}
	</select>
	{#if $errors.agentRole}
		<small>{$errors.agentRole[0]}</small>
	{/if}
	<label for="ability-count">Ability Count</label>
	abilityCount = {$abilityCount}
	<button type="button" class="bg-green-300" onclick={() => $abilityCount++}>+</button>
	<button
		type="button"
		class="bg-red-300"
		onclick={() => {
			$abilityCount = Math.max($abilityCount - 1, 0);
		}}>-</button
	>
	<button
		type="button"
		class="bg-purple-300"
		onclick={() => ($abilityCount = DEFAULT_ABILITY_COUNT)}>RESET</button
	>
	{#each { length: $abilityCount } as _, i}
		<label for="abilityId">Ability ID: {i}</label>
		<label for={`abilities[${i}].abilityName`}>Ability Name</label>
		<input
			type="text"
			name={`abilities[${i}].abilityName`}
			bind:value={$form.abilities[i].abilityName}
		/>
		{#if $errors.abilities && $errors.abilities[i] && $errors.abilities[i].abilityName}
			<small>{$errors.abilities[i].abilityName[0]} </small>
		{/if}
		<label for={`abilities[${i}].abilityNameID`}>Ability Name ID</label>
		<input
			type="text"
			name={`abilities[${i}].abilityNameID`}
			bind:value={$form.abilities[i].abilityNameID}
		/>
		{#if $errors.abilities && $errors.abilities[i] && $errors.abilities[i].abilityNameID}
			<small>{$errors.abilities[i].abilityNameID[0]} </small>
		{/if}
	{/each}
	<button type="submit" class="bg-red-300">SUBMIT</button>
</form>

<style lang="css">
	small {
		--tw-text-opacity: 1;
		color: rgb(239 68 68 / var(--tw-text-opacity)); /* #ef4444 */
	}
</style>
