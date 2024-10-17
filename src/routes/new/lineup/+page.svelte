<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { Ability } from '$lib/server/db/types';
	import ClickableImage from './ClickableImage.svelte';
	import LineupShowOverlay from '../../lineups/[valorant_agent]/[valorant_map]/LineupShowOverlay.svelte';
	export let data;
	const { form, errors, enhance, message } = superForm(data.form, {
		taintedMessage: 'Changes you made may not be saved.',
		validationMethod: 'submit-only'
	});
	enum OverlayMode {
		Main,
		Sub1,
		Sub2
	}
	let descriptionTextArea: HTMLTextAreaElement;
	let agentAbilities: Ability[];
	let throwLineup: FileList;
	let throwGif: FileList;
	let landSpot: FileList;
	let throwSpotFirstPerson: FileList;
	let throwSpotThirdPerson: FileList;
	let overlayMode = OverlayMode.Main;
	let sub1: number | null;
	$: sub1 = $form.sub1X;
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
			agentAbilities = data.agent_abilities[$form.agent];
			$form.ability = 0;
		}}
	>
		<option hidden selected />
		{#each Object.values(data.game_info.agents) as agent}
			<option value={agent.ID}>{agent.Name}</option>
		{/each}
	</select>
	{#if $errors.agent}
		<small>{$errors.agent[0]}</small>
	{/if}

	<label for="map">Map</label>
	<select name="map" bind:value={$form.map}>
		<option hidden selected />
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
			<option hidden selected />
			{#each agentAbilities as ability}
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
	<input
		type="file"
		name="throwLineup"
		bind:value={$form.throwLineup}
		bind:files={throwLineup}
		accept="image/jpeg"
	/>
	{#if $errors.throwLineup}
		<small>{$errors.throwLineup[0]}</small>
	{/if}

	<label for="throwGif">Throw Gif</label>

	<input
		type="file"
		name="throwGif"
		bind:value={$form.throwGif}
		bind:files={throwGif}
		accept="image/gif"
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
		accept="image/jpeg"
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
		bind:files={throwSpotThirdPerson}
		accept="image/jpeg"
	/>
	{#if $errors.throwSpotThirdPerson}
		<small>{$errors.throwSpotThirdPerson[0]}</small>
	{/if}

	<label for="grade">Grade</label>
	<select name="grade" bind:value={$form.grade}>
		<option hidden selected />
		{#each Object.values(data.game_info.grades) as grade}
			<option value={grade.ID}>{grade.Name}</option>
		{/each}
	</select>
	{#if $errors.grade}
		<small>{$errors.grade[0]}</small>
	{/if}

	<label for="throwType">Throw Type</label>
	<select name="throwType" bind:value={$form.throwType}>
		<option hidden selected />
		{#each Object.values(data.game_info.throw_types) as throw_type}
			<option value={throw_type.ID}>{throw_type.Name}</option>
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
				descriptionTextArea.value = descriptionTextArea.value.replaceAll('\n', ' ');
			});
		}}
		on:keydown={(event) => {
			if (event.key == 'Enter') {
				event.preventDefault();
			}
		}}
		bind:this={descriptionTextArea}
		bind:value={$form.description}
	/>
	{#if $errors.description}
		<small>{$errors.description[0]}</small>
	{/if}

	<label for="mainX">mainX (%)</label>
	<input type="text" name="mainX" bind:value={$form.mainX} placeholder="0" />
	{#if $errors.mainX}
		<small>{$errors.mainX[0]}</small>
	{/if}

	<label for="mainY">mainY (%)</label>
	<input type="text" name="mainY" bind:value={$form.mainY} placeholder="0" />
	{#if $errors.mainY}
		<small>{$errors.mainY[0]}</small>
	{/if}

	<label for="sub1X">Sub1X (%)</label>
	<input type="text" name="sub1X" bind:value={$form.sub1X} placeholder="0" />
	{#if $errors.sub1X}
		<small>{$errors.sub1X[0]}</small>
	{/if}

	<label for="sub1Y">Sub1Y (%)</label>
	<input type="text" name="sub1Y" bind:value={$form.sub1Y} placeholder="0" />
	{#if $errors.sub1Y}
		<small>{$errors.sub1Y[0]}</small>
	{/if}

	<label for="sub2X">Sub2X (%)</label>
	<input type="text" name="sub2X" bind:value={$form.sub2X} placeholder="0" />
	{#if $errors.sub2X}
		<small>{$errors.sub2X[0]}</small>
	{/if}

	<label for="sub2Y">Sub2Y (%)</label>
	<input type="text" name="sub2Y" bind:value={$form.sub2Y} placeholder="0" />
	{#if $errors.sub2Y}
		<small>{$errors.sub2Y[0]}</small>
	{/if}
	{#if $errors._errors}
		<small>{$errors._errors[0]}</small>
	{/if}

	<button type="submit" class="bg-red-300">button</button>
</form>

<form class="m-4">
	<input
		type="radio"
		id="main"
		name="overlay-mode"
		value={OverlayMode.Main}
		bind:group={overlayMode}
	/>
	<label for="main">Main</label>

	<input
		type="radio"
		id="sub1"
		name="overlay-mode"
		value={OverlayMode.Sub1}
		bind:group={overlayMode}
		on:click={() => {
			$form.sub1X ??= 0;
			$form.sub1Y ??= 0;
			$form.sub2X ??= 0;
			$form.sub2Y ??= 0;
		}}
	/>
	<label for="sub1">Sub1</label>

	<input
		type="radio"
		id="sub2"
		name="overlay-mode"
		value={OverlayMode.Sub2}
		bind:group={overlayMode}
		on:click={() => {
			$form.sub1X ??= 0;
			$form.sub1Y ??= 0;
			$form.sub2X ??= 0;
			$form.sub2Y ??= 0;
		}}
	/>
	<label for="sub2">Sub2</label>
</form>
{#if throwLineup}
	<div class="aspect-video w-[100rem] bg-red relative m-4">
		<LineupShowOverlay
			DrawOverMainX={$form.mainX}
			DrawOverMainY={$form.mainY}
			DrawOverSub1X={$form.sub1X}
			DrawOverSub1Y={$form.sub1Y}
			DrawOverSub2X={$form.sub2X}
			DrawOverSub2Y={$form.sub2Y}
		/>
		<ClickableImage
			src={URL.createObjectURL(throwLineup[0])}
			alt={`Preview image of "Throw Lineup"`}
			onClick={(x, y) => {
				switch (overlayMode) {
					case OverlayMode.Main:
						$form.mainX = x;
						$form.mainY = y;
						break;
					case OverlayMode.Sub1:
						$form.sub1X = x;
						$form.sub1Y = y;
						break;
					case OverlayMode.Sub2:
						$form.sub2X = x;
						$form.sub2Y = y;
						break;
				}
			}}
		/>
	</div>
{/if}

<style lang="css">
	small {
		--tw-text-opacity: 1;
		color: rgb(239 68 68 / var(--tw-text-opacity)); /* #ef4444 */
	}
</style>
