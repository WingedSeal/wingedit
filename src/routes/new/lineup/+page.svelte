<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { Grade, ThrowType } from './../../lineups/[valorant_agent]/[valorant_map]/types';
	export let data;
	const { form, errors, enhance, message, constraints } = superForm(data.form);
	const throw_types = Object(ThrowType);
</script>

<SuperDebug data={form} />

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
	<select name="agent" bind:value={$form.agent}>
		<option hidden selected />
		{#each data.agents as agent}
			<option value={agent.ID}>{agent.Name}</option>
		{/each}
	</select>
	{#if $errors.agent}
		<small>{$errors.agent}</small>
	{/if}

	<label for="map">Map</label>
	<select name="map" bind:value={$form.map}>
		<option hidden selected />
		{#each data.maps as map}
			<option value={map.ID}>{map.Name}</option>
		{/each}
	</select>
	{#if $errors.map}
		<small>{$errors.map}</small>
	{/if}

	<label for="ability">Ability</label>
	<select name="ability" bind:value={$form.ability}>
		<option hidden selected />
		<option value={1}>PLACEHOLDER</option>
	</select>

	{#if $errors.ability}
		<small>{$errors.ability}</small>
	{/if}

	<label for="throwLineup">Throw Lineup</label>
	<input
		type="file"
		name="throwLineup"
		bind:value={$form.throwLineup}
		accept="image/png, image/jpeg"
	/>
	{#if $errors.throwLineup}
		<small>{$errors.throwLineup}</small>
	{/if}

	<label for="throwGif">Throw Gif</label>
	<input type="file" name="throwGif" bind:value={$form.throwGif} accept="image/gif" />
	{#if $errors.throwGif}
		<small>{$errors.throwGif}</small>
	{/if}

	<label for="landSpot">Land Spot</label>
	<input type="file" name="landSpot" bind:value={$form.landSpot} accept="image/png, image/jpeg" />
	{#if $errors.landSpot}
		<small>{$errors.landSpot}</small>
	{/if}

	<label for="throwSpotFirstPerson">Throw Spot First Person</label>
	<input
		type="file"
		name="throwSpotFirstPerson"
		bind:value={$form.throwSpotFirstPerson}
		accept="image/png, image/jpeg"
	/>
	{#if $errors.throwSpotFirstPerson}
		<small>{$errors.throwSpotFirstPerson}</small>
	{/if}

	<label for="throwSpotThirdPerson">Throw Spot Third Person</label>
	<input
		type="file"
		name="throwSpotThirdPerson"
		bind:value={$form.throwSpotThirdPerson}
		accept="image/png, image/jpeg"
	/>
	{#if $errors.throwSpotThirdPerson}
		<small>{$errors.throwSpotThirdPerson}</small>
	{/if}

	<label for="grade">Grade</label>
	<select name="grade" bind:value={$form.grade}>
		<option hidden selected />
		{#each Object.values(Grade) as grade}
			<option value={grade}>{grade}</option>
		{/each}
	</select>
	{#if $errors.grade}
		<small>{$errors.grade}</small>
	{/if}

	<label for="throwType">Throw Type</label>
	<select name="throwType" bind:value={$form.throwType}>
		<option hidden selected />
		{#each Object.keys(ThrowType) as throw_type}
			<option value={throw_type}>{throw_types[throw_type]}</option>
		{/each}
	</select>
	{#if $errors.throwType}
		<small>{$errors.throwType}</small>
	{/if}

	<button type="submit" class="bg-red-300">button</button>
</form>
