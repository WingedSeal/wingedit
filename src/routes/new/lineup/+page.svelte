<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getLineupSchema } from '$lib/schema';
	import '$lib/styles/form.scss';
	import type { Ability } from '$lib/server/db/types.js';

	const schema = getLineupSchema(null, '', null, '');

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, {
		validators: zodClient(schema),
		taintedMessage: 'Changes you made may not be saved.',
		validationMethod: 'onsubmit'
	});

	let agentAbilities = $state<Ability[]>();
</script>

{#snippet scrollDown(n: number)}
	<button
		type="button"
		onclick={() => {
			document.getElementsByClassName('section')[n].scrollIntoView({
				behavior: 'smooth'
			});
		}}
		aria-label="scroll down"
		class="text-4xl m-auto animate-bounce"
	>
		<i class="fa-solid fa-angles-down"></i>
	</button>
{/snippet}

<main class="snap-mandatory snap-y h-dvh-nav overflow-y-auto">
	<form
		method="post"
		use:enhance
		action="?/upload"
		class="h-full w-full flex-col main-form"
		enctype="multipart/form-data"
	>
		<section class="bg-red-100 section h-dvh-nav">
			<div class="w-1/3 bg-red-300"></div>
			<div class="w-2/3 flex px-12 pt-12 pb-6 flex-col">
				<div class="w-full flex gap-8">
					<div class="w-1/2 flex flex-col">
						<label for="agent" class="main-label">Agent</label>
						<select
							name="agent"
							bind:value={$form.agent}
							onchange={() => {
								agentAbilities = Object.values(data.abilities[$form.agent]);
								$form.ability = 0;
							}}
						>
							<option hidden selected value={0}>- Select an Agent -</option>
							{#each Object.values(data.gameInfo.agents) as agent}
								<option value={agent.ID}>
									{agent.Name}
								</option>
							{/each}
						</select>
						<label for="agent" class="error">
							{#if $errors.agent}
								{$errors.agent[0]}
							{/if}
						</label>

						<label for="ability" class="main-label">Ability</label>
						<select name="ability" bind:value={$form.ability}>
							{#if agentAbilities}
								<option hidden selected value={0}>- Select an Ability -</option>
								{#each agentAbilities as ability}
									<option value={ability.AbilityID}>{ability.Name}</option>
								{/each}
							{:else}
								<option selected value={0}>- Please select an Agent. -</option>
							{/if}
						</select>
						<label for="ability" class="error">
							{#if $errors.ability}
								{$errors.ability[0]}
							{/if}
						</label>

						<label for="map" class="main-label">Map</label>
						<select name="map" bind:value={$form.map}>
							<option hidden selected value={0}>- Select a Map -</option>
							{#each Object.values(data.gameInfo.maps) as map}
								<option value={map.ID}>{map.Name}</option>
							{/each}
						</select>
						<label for="map" class="error">
							{#if $errors.map}
								{$errors.map[0]}
							{/if}
						</label>

						<label for="throwType" class="main-label">Throw Type</label>
						<select name="throwType" bind:value={$form.throwType}>
							<option hidden selected value={0}>- Select Throw Type -</option>
							{#each Object.values(data.gameInfo.throw_types) as throw_type}
								<option value={throw_type.ID}>{throw_type.Name}</option>
							{/each}
						</select>
						<label for="throwType" class="error">
							{#if $errors.throwType}
								{$errors.throwType[0]}
							{/if}
						</label>
					</div>
					<div class="w-1/2 flex flex-col">
						<label for="grade" class="main-label">Grade</label>
						<select name="grade" bind:value={$form.grade}>
							<option hidden selected value={0}>- Select Grade -</option>
							{#each Object.values(data.gameInfo.grades) as grade}
								<option value={grade.ID}>{grade.Name}</option>
							{/each}
						</select>
						<label for="grade" class="error">
							{#if $errors.grade}
								{$errors.grade[0]}
							{/if}
						</label>

						<label for="difficulty" class="main-label">Difficulty</label>
						<select name="grade" bind:value={$form.difficulty}>
							<option hidden selected value={0}>- Select Difficulty -</option>
							{#each Object.values(data.gameInfo.grades) as difficulty}
								<option value={difficulty.ID}>{difficulty.Name}</option>
							{/each}
						</select>
						<label for="difficulty" class="error">
							{#if $errors.difficulty}
								{$errors.difficulty[0]}
							{/if}
						</label>

						<label for="side" class="main-label">Side</label>
						<select name="side" bind:value={$form.side}>
							{#each Object.values(data.gameInfo.sides) as side}
								<option value={side.ID}>{side.Name}</option>
							{/each}
						</select>
						<label for="side" class="error">
							{#if $errors.side}
								{$errors.side[0]}
							{/if}
						</label>

						<label for="timeToLand" class="main-label">Time to land (s)</label>
						<input
							type="number"
							name="timeToLand"
							min="0"
							max="300"
							step="0.01"
							bind:value={$form.timeToLand}
							placeholder="0"
						/>
						<label for="timeToLand" class="error">
							{#if $errors.timeToLand}
								{$errors.timeToLand[0]}
							{/if}
						</label>
					</div>
				</div>
				<div class="flex flex-col grow">
					<label for="description" class="main-label">Description</label>
					<textarea
						name="description"
						onpaste={(event) => {
							setTimeout(() => {
								(event.target as HTMLTextAreaElement).value = (
									event.target as HTMLTextAreaElement
								).value.replaceAll('\n', ' ');
							});
						}}
						onkeydown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
							}
						}}
						class="p-4 h-full rounded-md indent-6 text-lg border-2 border-black"
						placeholder="Lineup's description"
						bind:value={$form.description}
					></textarea>
					{#if $errors.description}
						<label for="description" class="error">{$errors.description[0]}</label>
					{/if}
				</div>
				<div class="h-20 flex">
					{@render scrollDown(1)}
				</div>
			</div>
		</section>
		<section class="bg-blue-100 section h-dvh-nav"></section>
		<section class="bg-yellow-100 section h-dvh-nav"></section>
		<section class="bg-green-100 section h-dvh-nav"></section>
	</form>
</main>

<style lang="postcss">
	.main-form {
		select,
		input {
			@apply p-2 mb-1 border-2 border-black rounded-md text-lg;
		}

		& .main-label {
			@apply font-bold text-2xl mb-2;
		}
	}

	.section {
		@apply flex snap-center;
	}
</style>
