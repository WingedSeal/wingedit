<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { Grade, ThrowType } from './../../lineups/[valorant_agent]/[valorant_map]/types';
	import type { Ability } from '$lib/server/db/types';
	export let data;
	const { form, errors, enhance, message } = superForm(data.form, {
		taintedMessage: 'Changes you made may not be saved.',
		validationMethod: 'submit-only'
	});
	const throw_types = Object(ThrowType);
	let description_text_area: HTMLTextAreaElement;
	let agent_abilities: Ability[];
</script>

{#if $message}
	{$message}
{/if}
<form
	method="post"
	use:enhance
	action="?/upload"
	class="flex flex-col w-1/2 p-10"
	enctype="multipart/form-data"
>
	<label for="agent">Agent</label>
	<select
		name="agent"
		bind:value={$form.agent}
		on:change={() => {
			agent_abilities = data.abilities[$form.agent];
			$form.ability = 0;
		}}
	>
		<option hidden selected />
		{#each data.agents as agent}
			<option value={agent.ID}>{agent.Name}</option>
		{/each}
	</select>
	{#if $errors.agent}
		<small>{$errors.agent[0]}</small>
	{/if}

	<label for="map">Map</label>
	<select name="map" bind:value={$form.map}>
		<option hidden selected />
		{#each data.maps as map}
			<option value={map.ID}>{map.Name}</option>
		{/each}
	</select>
	{#if $errors.map}
		<small>{$errors.map[0]}</small>
	{/if}

	<label for="ability">Ability</label>
	<select name="ability" bind:value={$form.ability}>
		{#if agent_abilities}
			<option hidden selected />
			{#each agent_abilities as ability}
				<option value={ability.AbilityID}>{ability.Name}</option>
			{/each}
		{:else}
			<option selected />
		{/if}
	</select>

	{#if $errors.ability}
		<small>{$errors.ability[0]} </small>
	{/if}

	<label for="throwLineup">Throw Lineup</label>
	<input type="file" name="throwLineup" bind:value={$form.throwLineup} accept="image/jpeg" />
	{#if $errors.throwLineup}
		<small>{$errors.throwLineup[0]}</small>
	{/if}

	<label for="throwGif">Throw Gif</label>

	<input type="file" name="throwGif" bind:value={$form.throwGif} accept="image/gif" />
	{#if $errors.throwGif}
		<small>{$errors.throwGif[0]}</small>
	{/if}

	<label for="landSpot">Land Spot</label>
	<input type="file" name="landSpot" bind:value={$form.landSpot} accept="image/jpeg" />
	{#if $errors.landSpot}
		<small>{$errors.landSpot[0]}</small>
	{/if}

	<label for="throwSpotFirstPerson">Throw Spot First Person</label>
	<input
		type="file"
		name="throwSpotFirstPerson"
		bind:value={$form.throwSpotFirstPerson}
		accept="image/jpeg"
	/>
	{#if $errors.throwSpotFirstPerson}
		<small>{$errors.throwSpotFirstPerson[0]}</small>
	{/if}

	<label for="throwSpotThirdPerson">Throw Spot Third Person</label>
	<input
		type="file"
		name="throwSpotThirdPerson"
		bind:value={$form.throwSpotThirdPerson}
		accept="image/jpeg"
	/>
	{#if $errors.throwSpotThirdPerson}
		<small>{$errors.throwSpotThirdPerson[0]}</small>
	{/if}

	<label for="grade">Grade</label>
	<select name="grade" bind:value={$form.grade}>
		<option hidden selected />
		{#each Object.values(Grade) as grade}
			<option value={grade}>{grade}</option>
		{/each}
	</select>
	{#if $errors.grade}
		<small>{$errors.grade[0]}</small>
	{/if}

	<label for="throwType">Throw Type</label>
	<select name="throwType" bind:value={$form.throwType}>
		<option hidden selected />
		{#each Object.keys(ThrowType) as throw_type}
			<option value={throw_type}>{throw_types[throw_type]}</option>
		{/each}
	</select>
	{#if $errors.throwType}
		<small>{$errors.throwType[0]}</small>
	{/if}

	<label for="timeToLand">Time to land (s)</label>
	<input type="text" name="timeToLand" bind:value={$form.timeToLand} placeholder="0" />

	{#if $errors.timeToLand}
		<small>{$errors.timeToLand[0]}</small>
	{/if}

	<label for="description">Description</label>
	<textarea
		name="description"
		id=""
		on:paste={() => {
			setTimeout(() => {
				description_text_area.value = description_text_area.value.replaceAll('\n', ' ');
			});
		}}
		on:keydown={(event) => {
			if (event.key == 'Enter') {
				event.preventDefault();
			}
		}}
		bind:this={description_text_area}
		bind:value={$form.description}
	/>
	{#if $errors.description}
		<small>{$errors.description[0]}</small>
	{/if}

	<button type="submit" class="bg-red-300">button</button>
</form>

<style lang="css">
	small {
		--tw-text-opacity: 1;
		color: rgb(239 68 68 / var(--tw-text-opacity)); /* #ef4444 */
	}
</style>
