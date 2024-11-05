<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getLineupSchema } from '$lib/schema';
	import '$lib/styles/form.scss';
	import type { Ability } from '$lib/server/db/types.js';
	import { FromToMode, OverlayMode } from './enum.js';
	import ClickableImage from './ClickableImage.svelte';
	import LineupShowOverlay from '$lib/components/LineupShowOverlay.svelte';
	import Popup, { isPopupShow } from '$lib/components/Popup.svelte';
	import { enhance as svelteEnhance } from '$app/forms';

	const schema = getLineupSchema(null, '', null, '');

	let { data, form: addMapPositionForm } = $props();
	const {
		form,
		errors,
		enhance: superEnhance
	} = superForm(data.form, {
		validators: zodClient(schema),
		taintedMessage: 'Changes you made may not be saved.'
	});

	let agentAbilities = $state<Ability[]>();
	let selectedOverlayMode = $state<OverlayMode>(OverlayMode.Main);
	let selectedFromToMode = $state<FromToMode>(FromToMode.From);

	const ADD_MAP_POSITION_VALUE = '__add__';
	const onMapPositionChange = (event: Event) => {
		let target = event.target! as HTMLSelectElement;
		if (target.value !== ADD_MAP_POSITION_VALUE) {
			return;
		}
		$isPopupShow = true;
	};

	// $effect.pre(() => {
	// 	if (addMapPositionForm?.success) {
	// 		data.gameInfo.mapPositions[$form.map][addMapPositionForm.newPosition.ID] =
	// 			addMapPositionForm.newPosition;
	// 	}
	// });
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

{#snippet uploadFile(
	_for: 'throwLineup' | 'throwGif' | 'landSpot' | 'throwSpotFirstPerson' | 'throwSpotThirdPerson',
	text: string
)}
	<label for={_for} class="absolute top-2 left-2 main-label z-20 text-outline">{text}</label>
	<label for={_for} class="absolute top-0 left-0 w-full h-full cursor-pointer z-20"></label>
	<input
		type="file"
		name={_for}
		id={_for}
		oninput={(e) => ($form[_for] = e.currentTarget.files?.item(0) as File)}
		accept={_for === 'throwGif' ? 'image/gif, image/webp' : 'image/jpeg, image/png, image/webp'}
		class="hidden"
	/>
	{#if $form[_for]}
		<img
			class="absolute top-0 left-0 w-full h-full z-10"
			src={URL.createObjectURL($form[_for])}
			alt={text}
		/>
	{/if}
	<label for={_for} class="error absolute bottom-1 left-1 z-20">
		{#if $errors[_for]}
			{$errors[_for][0]}
		{/if}
	</label>
{/snippet}

<main class="snap-mandatory snap-y h-dvh-nav overflow-y-auto">
	<form
		method="post"
		use:superEnhance
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

		<section
			class="bg-blue-100 section h-dvh-nav flex flex-col justify-center items-center py-12 pt-12 pb-6"
		>
			<div class="aspect-video max-h-[calc(100%-5rem)] max-w-full overflow-hidden relative">
				<div class="h-screen w-screen invisible"></div>
				<div
					class="absolute h-full w-full top-0 left-0 grid grid-cols-3 grid-rows-3 gap-x-16 gap-y-9"
				>
					<div class="row-span-2 col-span-2 relative bg-purple-200">
						{@render uploadFile('throwLineup', 'How to Lineup')}
					</div>
					<div class=" bg-sky-100 relative">
						{@render uploadFile('throwGif', 'Throw Gif')}
					</div>
					<div class=" bg-green-100 relative">
						{@render uploadFile('landSpot', 'Land Spot')}
					</div>
					<div class=" bg-yellow-100 relative">TODO: Upload extra images</div>
					<div class=" bg-orange-100 relative">
						{@render uploadFile('throwSpotFirstPerson', 'Throw Spot First Person')}
					</div>
					<div class=" bg-red-100 relative">
						{@render uploadFile('throwSpotThirdPerson', 'Throw Spot Third Person')}
					</div>
				</div>
			</div>
			<div class="h-20 flex">
				{@render scrollDown(2)}
			</div>
		</section>
		<section class="bg-yellow-100 section h-dvh-nav">
			<div class="w-3/4 bg-yellow-300 p-4 flex flex-col">
				<div class="max-w-full max-h-[calc(100%-7rem)] grow-0 aspect-video relative m-auto">
					<div class="h-dvh w-[75dvw] invisible"></div>

					<div class="aspect-video bg-black h-full w-full absolute top-0 left-0">
						{#if $form.throwLineup}
							<div class="w-full h-full relative">
								<LineupShowOverlay
									DrawOverMainX={$form.mainX}
									DrawOverMainY={$form.mainY}
									DrawOverSub1X={$form.sub1X || null}
									DrawOverSub1Y={$form.sub1Y || null}
									DrawOverSub2X={$form.sub2X || null}
									DrawOverSub2Y={$form.sub2Y || null}
								/>
								<ClickableImage
									src={URL.createObjectURL($form.throwLineup)}
									alt={`Preview image of "Throw Lineup"`}
									onClick={(x, y) => {
										switch (selectedOverlayMode) {
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
					</div>
				</div>

				<div class="grow flex select-overlay-mode justify-around mt-5 relative">
					<input
						type="radio"
						form="none"
						id="main"
						name="overlay-mode"
						class="sr-only"
						value={OverlayMode.Main}
						bind:group={selectedOverlayMode}
					/>
					<label for="main" class="cursor-pointer">Main</label>

					<input
						type="radio"
						form="none"
						id="sub1"
						name="overlay-mode"
						class="sr-only"
						value={OverlayMode.Sub1}
						bind:group={selectedOverlayMode}
						tabindex="0"
						onclick={() => {
							$form.sub1X ??= $form.mainX;
							$form.sub1Y ??= $form.mainY;
							$form.sub2X ??= $form.mainX;
							$form.sub2Y ??= $form.mainY;
						}}
					/>
					<label for="sub1" class="cursor-pointer">Sub1</label>

					<input
						type="radio"
						form="none"
						id="sub2"
						name="overlay-mode"
						class="sr-only"
						value={OverlayMode.Sub2}
						bind:group={selectedOverlayMode}
						onclick={() => {
							$form.sub1X ??= $form.mainX;
							$form.sub1Y ??= $form.mainY;
							$form.sub2X ??= $form.mainX;
							$form.sub2Y ??= $form.mainY;
						}}
					/>
					<label for="sub2" class="cursor-pointer">Sub2</label>
				</div>
			</div>
			<div class="w-1/4 flex flex-col px-12 pt-12 pb-2">
				<label for="mainX" class="main-label">Main Circle (X-axis)</label>
				<input
					type="number"
					name="mainX"
					bind:value={$form.mainX}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
				/>
				<label for="mainX" class="error">
					{#if $errors.mainX}
						{$errors.mainX[0]}
					{/if}
				</label>

				<label for="mainY" class="main-label">Main Circle (Y-axis)</label>
				<input
					type="number"
					name="mainY"
					bind:value={$form.mainY}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
				/>
				<label for="mainY" class="error">
					{#if $errors.mainY}
						{$errors.mainY[0]}
					{/if}
				</label>

				<label for="sub1X" class="main-label">Sub Circle 1 (X-axis)</label>
				<input
					type="number"
					name="sub1X"
					bind:value={$form.sub1X}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
				/>
				<label for="sub1X" class="error">
					{#if $errors.sub1X}
						{$errors.sub1X[0]}
					{/if}
				</label>

				<label for="sub1Y" class="main-label">Sub Circle 1 (Y-axis)</label>
				<input
					type="number"
					name="sub1Y"
					bind:value={$form.sub1Y}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
				/>
				<label for="sub1Y" class="error">
					{#if $errors.sub1Y}
						{$errors.sub1Y[0]}
					{/if}
				</label>

				<label for="sub2X" class="main-label">Sub Circle 2 (X-axis)</label>
				<input
					type="number"
					name="sub2X"
					bind:value={$form.sub2X}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
				/>
				<label for="sub2X" class="error">
					{#if $errors.sub2X}
						{$errors.sub2X[0]}
					{/if}
				</label>

				<label for="sub2Y" class="main-label">Sub Circle 2 (Y-axis)</label>
				<input
					type="number"
					name="sub2Y"
					bind:value={$form.sub2Y}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
				/>
				<label for="sub2Y" class="error">
					{#if $errors.sub2Y}
						{$errors.sub2Y[0]}
					{/if}
				</label>

				<div class="mt-auto h-20 flex">
					{@render scrollDown(3)}
				</div>
			</div>
		</section>
		<section class="bg-green-100 section h-dvh-nav">
			<div class="w-3/4 bg-green-300 p-4 flex flex-col">
				<div class="max-w-full max-h-[calc(100%-7rem)] grow-0 aspect-video relative m-auto">
					<div class="h-dvh w-[75dvw] invisible"></div>

					<div class="aspect-video bg-black h-full w-full absolute top-0 left-0">
						{#if $form.throwLineup}
							<div class="w-full h-full relative">
								<!-- TODO:  -->
							</div>
						{/if}
					</div>
				</div>

				<div class="grow flex select-overlay-mode justify-around mt-5 relative">
					<input
						type="radio"
						form="none"
						id="from"
						name="fromto-mode"
						class="sr-only"
						value={FromToMode.From}
						bind:group={selectedFromToMode}
					/>
					<label for="from" class="cursor-pointer">From</label>

					<input
						type="radio"
						form="none"
						id="to"
						name="fromto-mode"
						class="sr-only"
						value={FromToMode.To}
						bind:group={selectedFromToMode}
					/>
					<label for="to" class="cursor-pointer">To</label>
				</div>
			</div>
			<div class="w-1/4 flex flex-col px-12 pt-12 pb-2">
				<label for="from" class="main-label">From</label>
				<select
					name="from"
					onchange={(e) => {
						$form.from = 0;
						onMapPositionChange(e);
					}}
					bind:value={$form.from}
				>
					{#if $form.map}
						<option hidden selected value={0}>- Select From Position -</option>
						{#if data.gameInfo.mapPositions[$form.map]}
							{#each Object.values(data.gameInfo.mapPositions[$form.map]) as mapPosition}
								<option value={mapPosition.ID}>{mapPosition.Callout}</option>
							{/each}
						{/if}
						<option value={ADD_MAP_POSITION_VALUE}>- Add Map Position -</option>
					{:else}
						<option hidden selected value={0}>- Please select a Map. -</option>
					{/if}
				</select>
				<label for="from" class="error">
					{#if $errors.from}
						{$errors.from[0]}
					{/if}
				</label>

				<label for="to" class="main-label">To</label>
				<select
					name="to"
					onchange={(e) => {
						$form.to = 0;
						onMapPositionChange(e);
					}}
					bind:value={$form.to}
				>
					{#if $form.map}
						<option hidden selected value={0}>- Select To Position -</option>
						{#if data.gameInfo.mapPositions[$form.map]}
							{#each Object.values(data.gameInfo.mapPositions[$form.map]) as mapPosition}
								<option value={mapPosition.ID}>{mapPosition.Callout}</option>
							{/each}
						{/if}
						<option value={ADD_MAP_POSITION_VALUE}>- Add Map Position -</option>
					{:else}
						<option hidden selected value={0}>- Please select a Map. -</option>
					{/if}
				</select>
				<label for="to" class="error">
					{#if $errors.to}
						{$errors.to[0]}
					{/if}
				</label>

				{#snippet input(_for: 'fromX' | 'fromY' | 'toX' | 'toY', text: string)}
					<label for={_for} class="main-label">{text}</label>
					<input
						type="number"
						name={_for}
						bind:value={$form[_for]}
						placeholder="0"
						min="0"
						max="100"
						step="0.01"
					/>
					<label for={_for} class="error">
						{#if $errors[_for]}
							{$errors[_for][0]}
						{/if}
					</label>
				{/snippet}

				{@render input('fromX', 'From (X-axis)')}
				{@render input('fromY', 'From (Y-axis)')}
				{@render input('toX', 'To (X-axis)')}
				{@render input('toY', 'To (Y-axis)')}

				<div class="mt-auto h-20 flex">
					{@render scrollDown(4)}
				</div>
			</div>
		</section>
		<section class="bg-slate-200 section h-dvh-nav"></section>
	</form>
</main>

<Popup title="Add new position">
	<form action="?/addMapPosition" class="main-form" method="post" use:svelteEnhance>
		<input type="text" name="map" class="hidden" value={$form.map} />

		<div class="flex flex-col bg-sky-100 m-12 h-full p-12 rounded-md">
			<label for="callout" class="main-label">Callout</label>
			<input type="text" name="callout" placeholder="New Map Position" />
			<label for="callout" class="error"> ERROR GOES HERE </label>
			<button type="submit" class="py-4 px-12 text-lg font-bold rounded-lg bg-blue-200 mx-auto"
				>Add</button
			>
			{JSON.stringify(addMapPositionForm)}
		</div>
	</form>
</Popup>

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
		@apply flex snap-center w-full;
	}

	.select-overlay-mode {
		label {
			@apply font-bold text-2xl my-auto block bg-white px-4 py-1 rounded-md;
		}

		input[type='radio']:checked + label {
			@apply text-red-600;
		}

		input[type='radio']:focus + label {
			outline: 2px solid Highlight;
			outline: 5px auto -webkit-focus-ring-color;
		}
	}

	.text-outline {
		--outline-size: 0.1rem;
		--outline-size-neg: calc(var(--outline-size) * -1);
		--outline-color: #ffffff;
		--outline-blur: 0;

		text-shadow:
			var(--outline-size-neg) var(--outline-size-neg) var(--outline-blur) var(--outline-color),
			var(--outline-size-neg) var(--outline-size) var(--outline-blur) var(--outline-color),
			var(--outline-size) var(--outline-size-neg) var(--outline-blur) var(--outline-color),
			var(--outline-size) var(--outline-size) var(--outline-blur) var(--outline-color);
	}

	.sr-only {
		clip: rect(0, 0, 0, 0);
		position: absolute;
		margin: -1px;
		overflow: hidden;
	}
</style>
