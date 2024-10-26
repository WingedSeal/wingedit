<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { Ability } from '$lib/server/db/types';
	import ClickableImage from './ClickableImage.svelte';
	import LineupShowOverlay from '$lib/components/LineupShowOverlay.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getLineupSchema } from '$lib/schema';
	import { z } from 'zod';

	let { data } = $props();
	const schema = getLineupSchema(z.any(), z.any());
	const { form, errors, enhance, message } = superForm(data.form, {
		validators: zodClient(schema),
		taintedMessage: 'Changes you made may not be saved.',
		validationMethod: 'onsubmit'
	});
	const onChange = (event: Event) => {
		let target = event.target! as HTMLSelectElement;
		if (target.value !== 'add') {
			return;
		}
		target.selectedIndex = 0;
		is_hidden = false;
	};
	type OverlayMode = number;
	const OverlayModes = {
		Main: 0,
		Sub1: 1,
		Sub2: 2
	};
	let is_hidden = $state(true);
	let descriptionTextArea: HTMLTextAreaElement;
	let agentAbilities = $state<Ability[]>();
	let throwLineup = $state<FileList>();
	let throwGif = $state<FileList>();
	let landSpot = $state<FileList>();
	let throwSpotFirstPerson = $state<FileList>();
	let throwSpotThirdPerson = $state<FileList>();
	let overlayMode = $state<OverlayMode>(OverlayModes.Main);
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
		onchange={() => {
			agentAbilities = Object.values(data.game_info.abilities[$form.agent]);
			$form.ability = 0;
		}}
	>
		<option hidden selected></option>
		{#each Object.values(data.game_info.agents) as agent}
			<option value={agent.ID}>{agent.Name}</option>
		{/each}
	</select>
	{#if $errors.agent}
		<small>{$errors.agent[0]}</small>
	{/if}

	<label for="map">Map</label>
	<select name="map" bind:value={$form.map}>
		<option hidden selected></option>
		{#each Object.values(data.game_info.maps) as map}
			<option value={map.ID}>{map.Name}</option>
		{/each}
	</select>
	{#if $errors.map}
		<small>{$errors.map[0]}</small>
	{/if}

	<label for="ability">Ability</label>
	<select name="ability" bind:value={$form.ability}>
		{#if agentAbilities}
			<option hidden selected></option>
			{#each agentAbilities as ability}
				<option value={ability.AbilityID}>{ability.Name}</option>
			{/each}
		{:else}
			<option selected></option>
		{/if}
	</select>

	{#if $errors.ability}
		<small>{$errors.ability[0]} </small>
	{/if}

	<label for="throwLineup">Throw Lineup</label>
	<input
		type="file"
		name="throwLineup"
		bind:value={$form.throwLineup}
		bind:files={throwLineup}
		accept="image/jpeg, image/png, image/webp"
	/>
	{#if $errors.throwLineup}
		<small>{$errors.throwLineup}</small>
	{/if}

	<label for="throwGif">Throw Gif</label>

	<input
		type="file"
		name="throwGif"
		bind:value={$form.throwGif}
		bind:files={throwGif}
		accept="image/gif, image/webp"
	/>
	{#if $errors.throwGif}
		<small>{$errors.throwGif[0]}</small>
	{/if}

	<label for="landSpot">Land Spot</label>
	<input
		type="file"
		name="landSpot"
		bind:value={$form.landSpot}
		bind:files={landSpot}
		accept="image/jpeg, image/png, image/webp"
	/>
	{#if $errors.landSpot}
		<small>{$errors.landSpot[0]}</small>
	{/if}

	<label for="throwSpotFirstPerson">Throw Spot First Person</label>
	<input
		type="file"
		name="throwSpotFirstPerson"
		bind:value={$form.throwSpotFirstPerson}
		bind:files={throwSpotFirstPerson}
		accept="image/jpeg, image/png, image/webp"
	/>
	{#if $errors.throwSpotFirstPerson}
		<small>{$errors.throwSpotFirstPerson[0]}</small>
	{/if}

	<label for="throwSpotThirdPerson">Throw Spot Third Person</label>
	<input
		type="file"
		name="throwSpotThirdPerson"
		bind:value={$form.throwSpotThirdPerson}
		bind:files={throwSpotThirdPerson}
		accept="image/jpeg, image/png, image/webp"
	/>
	{#if $errors.throwSpotThirdPerson}
		<small>{$errors.throwSpotThirdPerson[0]}</small>
	{/if}

	<label for="grade">Grade</label>
	<select name="grade" bind:value={$form.grade}>
		<option hidden selected></option>
		{#each Object.values(data.game_info.grades) as grade}
			<option value={grade.ID}>{grade.Name}</option>
		{/each}
	</select>
	{#if $errors.grade}
		<small>{$errors.grade[0]}</small>
	{/if}

	<label for="throwType">Throw Type</label>
	<select name="throwType" bind:value={$form.throwType}>
		<option hidden selected></option>
		{#each Object.values(data.game_info.throw_types) as throw_type}
			<option value={throw_type.ID}>{throw_type.Name}</option>
		{/each}
	</select>
	{#if $errors.throwType}
		<small>{$errors.throwType[0]}</small>
	{/if}

	<label for="timeToLand">Time to land (s)</label>
	<input
		type="number"
		name="timeToLand"
		min="0"
		max="300"
		step="0.01"
		bind:value={$form.timeToLand}
		placeholder="0"
	/>

	{#if $errors.timeToLand}
		<small>{$errors.timeToLand[0]}</small>
	{/if}

	<label for="description">Description</label>
	<textarea
		name="description"
		id=""
		onpaste={() => {
			setTimeout(() => {
				descriptionTextArea.value = descriptionTextArea.value.replaceAll('\n', ' ');
			});
		}}
		onkeydown={(event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
			}
		}}
		bind:this={descriptionTextArea}
		bind:value={$form.description}
	></textarea>
	{#if $errors.description}
		<small>{$errors.description[0]}</small>
	{/if}

	<label for="mainX">mainX (%)</label>
	<input
		type="number"
		name="mainX"
		bind:value={$form.mainX}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.mainX}
		<small>{$errors.mainX[0]}</small>
	{/if}

	<label for="mainY">mainY (%)</label>
	<input
		type="number"
		name="mainY"
		bind:value={$form.mainY}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.mainY}
		<small>{$errors.mainY[0]}</small>
	{/if}

	<label for="sub1X">Sub1X (%)</label>
	<input
		type="number"
		name="sub1X"
		bind:value={$form.sub1X}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.sub1X}
		<small>{$errors.sub1X[0]}</small>
	{/if}

	<label for="sub1Y">Sub1Y (%)</label>
	<input
		type="number"
		name="sub1Y"
		bind:value={$form.sub1Y}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.sub1Y}
		<small>{$errors.sub1Y[0]}</small>
	{/if}

	<label for="sub2X">Sub2X (%)</label>
	<input
		type="number"
		name="sub2X"
		bind:value={$form.sub2X}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.sub2X}
		<small>{$errors.sub2X[0]}</small>
	{/if}

	<label for="sub2Y">Sub2Y (%)</label>
	<input
		type="number"
		name="sub2Y"
		bind:value={$form.sub2Y}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.sub2Y}
		<small>{$errors.sub2Y[0]}</small>
	{/if}

	<label for="from">From:</label>
	<select name="from" onchange={onChange} bind:value={$form.from}>
		<option hidden selected></option>
		{#if data.game_info.mapPositions[$form.map]}
			{#each Object.values(data.game_info.mapPositions[$form.map]) as mapPosition}
				<option value={mapPosition.ID}>{mapPosition.Callout}</option>
			{/each}
		{/if}
		<option value="add">ADD MAP POSITION</option>
	</select>

	<label for="to">To:</label>
	<select name="to" onchange={onChange} bind:value={$form.to}>
		<option hidden selected></option>
		{#if data.game_info.mapPositions[$form.map]}
			{#each Object.values(data.game_info.mapPositions[$form.map]) as mapPosition}
				<option value={mapPosition.ID}>{mapPosition.Callout}</option>
			{/each}
		{/if}
		<option value="add">ADD MAP POSITION</option>
	</select>

	{#if $errors._errors}
		<small>{$errors._errors[0]}</small>
	{/if}

	<label for="fromX">fromX (%)</label>
	<input
		type="number"
		name="fromX"
		bind:value={$form.fromX}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.fromX}
		<small>{$errors.fromX[0]}</small>
	{/if}

	<label for="fromY">fromY (%)</label>
	<input
		type="number"
		name="fromY"
		bind:value={$form.fromY}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.fromY}
		<small>{$errors.fromY[0]}</small>
	{/if}

	<label for="toX">toX (%)</label>
	<input
		type="number"
		name="toX"
		bind:value={$form.toX}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.toX}
		<small>{$errors.toX[0]}</small>
	{/if}

	<label for="toY">toY (%)</label>
	<input
		type="number"
		name="toY"
		bind:value={$form.toY}
		placeholder="0"
		min="0"
		max="100"
		step="0.01"
	/>
	{#if $errors.toY}
		<small>{$errors.toY[0]}</small>
	{/if}

	<button type="submit" class="bg-red-300">button</button>
</form>

<form class="m-4">
	<input
		type="radio"
		id="main"
		name="overlay-mode"
		value={OverlayModes.Main}
		bind:group={overlayMode}
	/>
	<label for="main">Main</label>

	<input
		type="radio"
		id="sub1"
		name="overlay-mode"
		value={OverlayModes.Sub1}
		bind:group={overlayMode}
		onclick={() => {
			$form.sub1X ??= $form.mainX;
			$form.sub1Y ??= $form.mainY;
			$form.sub2X ??= $form.mainX;
			$form.sub2Y ??= $form.mainY;
		}}
	/>
	<label for="sub1">Sub1</label>

	<input
		type="radio"
		id="sub2"
		name="overlay-mode"
		value={OverlayModes.Sub2}
		bind:group={overlayMode}
		onclick={() => {
			$form.sub1X ??= $form.mainX;
			$form.sub1Y ??= $form.mainY;
			$form.sub2X ??= $form.mainX;
			$form.sub2Y ??= $form.mainY;
		}}
	/>
	<label for="sub2">Sub2</label>
</form>

{#if throwLineup}
	<div class="aspect-video w-[100rem] bg-red relative m-4">
		<LineupShowOverlay
			DrawOverMainX={$form.mainX}
			DrawOverMainY={$form.mainY}
			DrawOverSub1X={$form.sub1X || null}
			DrawOverSub1Y={$form.sub1Y || null}
			DrawOverSub2X={$form.sub2X || null}
			DrawOverSub2Y={$form.sub2Y || null}
		/>
		<ClickableImage
			src={URL.createObjectURL(throwLineup[0])}
			alt={`Preview image of "Throw Lineup"`}
			onClick={(x, y) => {
				switch (overlayMode) {
					case OverlayModes.Main:
						$form.mainX = x;
						$form.mainY = y;
						break;
					case OverlayModes.Sub1:
						$form.sub1X = x;
						$form.sub1Y = y;
						break;
					case OverlayModes.Sub2:
						$form.sub2X = x;
						$form.sub2Y = y;
						break;
				}
			}}
		/>
	</div>
{/if}

{#if $form.map}
	<img src={`/api/image/maps/${$form.map}/minimap.webp`} alt="minimap" />
{/if}

<Popup bind:is_hidden title="TITLE">
	<form action="?/addMapPosition" method="post">
		<label for="callout">Callout:</label>
		<input type="text" name="callout" />
		<button type="submit">ADD MAP POSITION</button>
	</form>
</Popup>

<style lang="css">
	small {
		--tw-text-opacity: 1;
		color: rgb(239 68 68 / var(--tw-text-opacity)); /* #ef4444 */
	}
</style>
