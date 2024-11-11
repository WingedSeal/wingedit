<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getLineupSchema, mapPositionSchema } from '$lib/schema';
	import '$lib/styles/form.scss';
	import type { Ability } from '$lib/server/db/types.js';
	import { FromToMode, OverlayMode } from './modes.js';
	import Clickable from './Clickable.svelte';
	import LineupShowOverlay from '$lib/components/LineupShowOverlay.svelte';
	import Popup, { isPopupShow } from '$lib/components/Popup.svelte';
	import { onMount } from 'svelte';
	import RenderEmptyLine from './EmptyLineupLineOverlay.svelte';
	import emptyBox from '$lib/assets/images/empty-box.webp';
	import { isEmpty } from '$lib/utils.js';

	const lineupSchema = getLineupSchema();

	const { data } = $props();
	let mapPositions = $state(data.gameInfo.mapPositions);

	const {
		errors: mapPositionDeleteErrors,
		message: mapPositionDeleteMessage,
		enhance: mapPositionDeleteEnhance
	} = superForm(data.mapPositionDeleteForm, {
		invalidateAll: false,
		applyAction: false,
		multipleSubmits: 'abort',
		resetForm: false,
		onUpdate: ({ form, result }) => {
			if (result.type !== 'success') return;
			const deletedMapPosition = form.message!.deletedMapPosition;
			delete mapPositions[deletedMapPosition.MapID][deletedMapPosition.ID];
			if (deletedMapPosition.ID === $lineupForm.from) {
				$lineupForm.from = null as unknown as number;
			}
			if (deletedMapPosition.ID === $lineupForm.to) {
				$lineupForm.to = null as unknown as number;
			}
		}
	});

	const {
		form: lineupForm,
		errors: lineupErrors,
		enhance: lineupEnhance,
		message: lineupMessage
	} = superForm(data.lineupForm, {
		validators: zodClient(lineupSchema),
		taintedMessage: 'Changes you made may not be saved.',
		scrollToError: { behavior: 'smooth', block: 'start', inline: 'nearest' }
	});

	const {
		form: mapPositionForm,
		errors: mapPositionErrors,
		enhance: mapPositionEnhance,
		message: mapPositionMessage
	} = superForm(data.mapPositionForm, {
		validators: zodClient(mapPositionSchema),
		resetForm: false,
		invalidateAll: false,
		onUpdate: (event) => {
			if (event.result.type !== 'success') return;
			if (!event.form.message) return;
			const mapPosition = event.form.message.newMapPosition;
			mapPositions[event.form.message.mapID] ??= {};
			mapPositions[event.form.message.mapID][mapPosition.ID] = { IsUsed: false, ...mapPosition };
			switch (mapPositionSource) {
				case 'from':
					$lineupForm.from = mapPosition.ID;
					break;
				case 'to':
					$lineupForm.to = mapPosition.ID;
					break;
			}
		}
	});

	let agentAbilities = $state<Ability[]>();
	let selectedOverlayMode = $state<OverlayMode>(OverlayMode.Main);
	let selectedFromToMode = $state<FromToMode>(FromToMode.From);

	let mapPositionSource: 'from' | 'to' = 'from';
	const ADD_MAP_POSITION_VALUE = '__add__';
	const onMapPositionChange = (event: Event, source: 'from' | 'to') => {
		let target = event.target! as HTMLSelectElement;
		if (target.value === ADD_MAP_POSITION_VALUE) {
			mapPositionSource = source;
			$isPopupShow = true;
			return true;
		}
		return false;
	};

	let minimapAspectRatio = 0;
	let mimimapContainer: HTMLDivElement;
	const resizeMinimap = () => {
		if (!minimapAspectRatio) return;
		mimimapContainer.style.width = '';
		mimimapContainer.style.height = '';
		if (mimimapContainer.clientWidth / mimimapContainer.clientHeight > minimapAspectRatio) {
			mimimapContainer.style.width = mimimapContainer.clientHeight * minimapAspectRatio + 'px';
		} else {
			mimimapContainer.style.height = mimimapContainer.clientWidth / minimapAspectRatio + 'px';
		}
	};

	onMount(() => {
		window.addEventListener('resize', resizeMinimap);
		const unsubscribe = lineupForm.subscribe((form) => {
			$mapPositionForm.mapID = form.map;
		});
		return () => {
			window.removeEventListener('resize', resizeMinimap);
			unsubscribe();
		};
	});
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
		tabindex="-1"
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
	<input
		type="file"
		name={_for}
		id={_for}
		oninput={(e) => ($lineupForm[_for] = e.currentTarget.files?.item(0) as File)}
		accept={_for === 'throwGif' ? 'image/gif, image/webp' : 'image/jpeg, image/png, image/webp'}
		class="sr-only"
		aria-invalid={$lineupErrors[_for] ? 'true' : undefined}
	/>
	<label for={_for} class="absolute top-0 left-0 w-full h-full cursor-pointer z-20"></label>
	{#if $lineupForm[_for]}
		<img
			class="absolute top-0 left-0 w-full h-full z-10"
			src={URL.createObjectURL($lineupForm[_for])}
			alt={text}
		/>
	{/if}
	<label for={_for} class="error absolute bottom-1 left-1 z-20 text-outline">
		{#if $lineupErrors[_for]}
			{$lineupErrors[_for][0]}
		{/if}
	</label>
{/snippet}

<main class="snap-mandatory snap-y h-dvh-nav overflow-y-auto">
	<form
		method="post"
		use:lineupEnhance
		action="?/addLineup"
		class="h-full w-full flex-col main-form"
		enctype="multipart/form-data"
	>
		<section class="bg-red-100 section h-dvh-nav">
			<div class="w-1/3 bg-red-300 relative">
				{#if $lineupForm.map}
					<img
						class="absolute w-full h-full object-cover"
						src="/api/image/maps/{$lineupForm.map}/bg.webp"
						alt="map"
					/>
				{/if}
				{#if $lineupForm.agent}
					<img
						class="absolute w-full h-full object-contain"
						src="/api/image/agents/{$lineupForm.agent}/full.webp"
						alt="agent"
					/>
				{/if}
			</div>
			<div class="w-2/3 flex px-12 pt-12 pb-6 flex-col">
				<div class="w-full flex gap-8">
					<div class="w-1/2 flex flex-col">
						<label for="agent" class="main-label">Agent</label>
						<select
							name="agent"
							bind:value={$lineupForm.agent}
							onchange={() => {
								agentAbilities = Object.values(data.abilities[$lineupForm.agent]);
								$lineupForm.ability = 0;
							}}
							aria-invalid={$lineupErrors.agent ? 'true' : undefined}
						>
							<option hidden selected value={0}>- Select an Agent -</option>
							{#each Object.values(data.gameInfo.agents) as agent}
								<option value={agent.ID}>
									{agent.Name}
								</option>
							{/each}
						</select>
						<label for="agent" class="error">
							{#if $lineupErrors.agent}
								{$lineupErrors.agent[0]}
							{/if}
						</label>

						<label for="ability" class="main-label">Ability</label>
						<select
							name="ability"
							bind:value={$lineupForm.ability}
							aria-invalid={$lineupErrors.ability ? 'true' : undefined}
						>
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
							{#if $lineupErrors.ability}
								{$lineupErrors.ability[0]}
							{/if}
						</label>

						<label for="map" class="main-label">Map</label>
						<select
							name="map"
							bind:value={$lineupForm.map}
							aria-invalid={$lineupErrors.map ? 'true' : undefined}
							onchange={() => {
								$lineupForm.from = null as unknown as number;
								$lineupForm.to = null as unknown as number;
							}}
						>
							<option hidden selected value={0}>- Select a Map -</option>
							{#each Object.values(data.gameInfo.maps) as map}
								<option value={map.ID}>{map.Name}</option>
							{/each}
						</select>
						<label for="map" class="error">
							{#if $lineupErrors.map}
								{$lineupErrors.map[0]}
							{/if}
						</label>

						<label for="throwType" class="main-label">Throw Type</label>
						<select
							name="throwType"
							bind:value={$lineupForm.throwType}
							aria-invalid={$lineupErrors.throwType ? 'true' : undefined}
						>
							<option hidden selected value={0}>- Select Throw Type -</option>
							{#each Object.values(data.gameInfo.throw_types) as throw_type}
								<option value={throw_type.ID}>{throw_type.Name}</option>
							{/each}
						</select>
						<label for="throwType" class="error">
							{#if $lineupErrors.throwType}
								{$lineupErrors.throwType[0]}
							{/if}
						</label>
					</div>
					<div class="w-1/2 flex flex-col">
						<label for="grade" class="main-label">Grade</label>
						<select
							name="grade"
							bind:value={$lineupForm.grade}
							aria-invalid={$lineupErrors.grade ? 'true' : undefined}
						>
							<option hidden selected value={0}>- Select Grade -</option>
							{#each Object.values(data.gameInfo.grades) as grade}
								<option value={grade.ID}>{grade.Name}</option>
							{/each}
						</select>
						<label for="grade" class="error">
							{#if $lineupErrors.grade}
								{$lineupErrors.grade[0]}
							{/if}
						</label>

						<label for="difficulty" class="main-label">Difficulty</label>
						<select
							name="difficulty"
							bind:value={$lineupForm.difficulty}
							aria-invalid={$lineupErrors.difficulty ? 'true' : undefined}
						>
							<option hidden selected value={0}>- Select Difficulty -</option>
							{#each Object.values(data.gameInfo.grades) as difficulty}
								<option value={difficulty.ID}>{difficulty.Name}</option>
							{/each}
						</select>
						<label for="difficulty" class="error">
							{#if $lineupErrors.difficulty}
								{$lineupErrors.difficulty[0]}
							{/if}
						</label>

						<label for="side" class="main-label">Side</label>
						<select
							name="side"
							bind:value={$lineupForm.side}
							aria-invalid={$lineupErrors.side ? 'true' : undefined}
						>
							{#each Object.values(data.gameInfo.sides) as side}
								<option value={side.ID}>{side.Name}</option>
							{/each}
						</select>
						<label for="side" class="error">
							{#if $lineupErrors.side}
								{$lineupErrors.side[0]}
							{/if}
						</label>

						<label for="timeToLand" class="main-label">Time to land (s)</label>
						<input
							type="number"
							name="timeToLand"
							min="0"
							max="300"
							step="0.01"
							bind:value={$lineupForm.timeToLand}
							placeholder="0"
							aria-invalid={$lineupErrors.timeToLand ? 'true' : undefined}
						/>
						<label for="timeToLand" class="error">
							{#if $lineupErrors.timeToLand}
								{$lineupErrors.timeToLand[0]}
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
						bind:value={$lineupForm.description}
						aria-invalid={$lineupErrors.description ? 'true' : undefined}
					></textarea>
					{#if $lineupErrors.description}
						<label for="description" class="error">{$lineupErrors.description[0]}</label>
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
					class="absolute h-full w-full top-0 left-0 grid grid-cols-3 grid-rows-3 gap-x-16 gap-y-9 select-file"
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
						{#if $lineupForm.throwLineup}
							<div class="w-full h-full relative">
								<LineupShowOverlay
									DrawOverMainX={$lineupForm.mainX}
									DrawOverMainY={$lineupForm.mainY}
									DrawOverSub1X={$lineupForm.sub1X || null}
									DrawOverSub1Y={$lineupForm.sub1Y || null}
									DrawOverSub2X={$lineupForm.sub2X || null}
									DrawOverSub2Y={$lineupForm.sub2Y || null}
								/>
								<Clickable
									buttonClass="aspect-video w-full h-full"
									onClick={(x, y) => {
										switch (selectedOverlayMode) {
											case OverlayMode.Main:
												$lineupForm.mainX = x;
												$lineupForm.mainY = y;
												break;
											case OverlayMode.Sub1:
												$lineupForm.sub1X = x;
												$lineupForm.sub1Y = y;
												break;
											case OverlayMode.Sub2:
												$lineupForm.sub2X = x;
												$lineupForm.sub2Y = y;
												break;
										}
									}}
								>
									<img
										class="h-full w-full"
										src={URL.createObjectURL($lineupForm.throwLineup)}
										alt={`Preview image of "Throw Lineup"`}
										draggable="false"
									/>
								</Clickable>
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
						class="hidden"
						value={OverlayMode.Main}
						bind:group={selectedOverlayMode}
					/>
					<label for="main" class="cursor-pointer">Main</label>

					<input
						type="radio"
						form="none"
						id="sub1"
						name="overlay-mode"
						class="hidden"
						value={OverlayMode.Sub1}
						bind:group={selectedOverlayMode}
						tabindex="0"
						onclick={() => {
							$lineupForm.sub1X ??= $lineupForm.mainX;
							$lineupForm.sub1Y ??= $lineupForm.mainY;
							$lineupForm.sub2X ??= $lineupForm.mainX;
							$lineupForm.sub2Y ??= $lineupForm.mainY;
						}}
					/>
					<label for="sub1" class="cursor-pointer">Sub1</label>

					<input
						type="radio"
						form="none"
						id="sub2"
						name="overlay-mode"
						class="hidden"
						value={OverlayMode.Sub2}
						bind:group={selectedOverlayMode}
						onclick={() => {
							$lineupForm.sub1X ??= $lineupForm.mainX;
							$lineupForm.sub1Y ??= $lineupForm.mainY;
							$lineupForm.sub2X ??= $lineupForm.mainX;
							$lineupForm.sub2Y ??= $lineupForm.mainY;
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
					bind:value={$lineupForm.mainX}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
					aria-invalid={$lineupErrors.mainX ? 'true' : undefined}
				/>
				<label for="mainX" class="error">
					{#if $lineupErrors.mainX}
						{$lineupErrors.mainX[0]}
					{/if}
				</label>

				<label for="mainY" class="main-label">Main Circle (Y-axis)</label>
				<input
					type="number"
					name="mainY"
					bind:value={$lineupForm.mainY}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
					aria-invalid={$lineupErrors.mainY ? 'true' : undefined}
				/>
				<label for="mainY" class="error">
					{#if $lineupErrors.mainY}
						{$lineupErrors.mainY[0]}
					{/if}
				</label>

				<label for="sub1X" class="main-label">Sub Circle 1 (X-axis)</label>
				<input
					type="number"
					name="sub1X"
					bind:value={$lineupForm.sub1X}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
					aria-invalid={$lineupErrors.sub1X ? 'true' : undefined}
				/>
				<label for="sub1X" class="error">
					{#if $lineupErrors.sub1X}
						{$lineupErrors.sub1X[0]}
					{/if}
				</label>

				<label for="sub1Y" class="main-label">Sub Circle 1 (Y-axis)</label>
				<input
					type="number"
					name="sub1Y"
					bind:value={$lineupForm.sub1Y}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
					aria-invalid={$lineupErrors.sub1Y ? 'true' : undefined}
				/>
				<label for="sub1Y" class="error">
					{#if $lineupErrors.sub1Y}
						{$lineupErrors.sub1Y[0]}
					{/if}
				</label>

				<label for="sub2X" class="main-label">Sub Circle 2 (X-axis)</label>
				<input
					type="number"
					name="sub2X"
					bind:value={$lineupForm.sub2X}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
					aria-invalid={$lineupErrors.sub2X ? 'true' : undefined}
				/>
				<label for="sub2X" class="error">
					{#if $lineupErrors.sub2X}
						{$lineupErrors.sub2X[0]}
					{/if}
				</label>

				<label for="sub2Y" class="main-label">Sub Circle 2 (Y-axis)</label>
				<input
					type="number"
					name="sub2Y"
					bind:value={$lineupForm.sub2Y}
					placeholder="0"
					min="0"
					max="100"
					step="0.01"
					aria-invalid={$lineupErrors.sub2Y ? 'true' : undefined}
				/>
				<label for="sub2Y" class="error">
					{#if $lineupErrors.sub2Y}
						{$lineupErrors.sub2Y[0]}
					{/if}
				</label>

				<div class="mt-auto h-20 flex">
					{@render scrollDown(3)}
				</div>
			</div>
		</section>
		<section class="bg-green-100 section h-dvh-nav">
			<div class="w-3/4 bg-green-300 p-4 flex">
				<div class="bg-black h-full w-full flex">
					<div class="bg-black h-full w-full flex m-auto" bind:this={mimimapContainer}>
						{#if $lineupForm.map}
							<Clickable
								buttonClass="w-full h-full relative"
								onClick={(x, y) => {
									switch (selectedFromToMode) {
										case FromToMode.From:
											$lineupForm.fromX = x;
											$lineupForm.fromY = y;
											break;
										case FromToMode.To:
											$lineupForm.toX = x;
											$lineupForm.toY = y;
											break;
									}
								}}
							>
								<img
									src="/api/image/maps/{$lineupForm.map}/minimap.webp"
									alt="bg.webp"
									class="w-full h-full"
									draggable="false"
									onload={(e) => {
										const image = e.target as HTMLImageElement;
										minimapAspectRatio = image.naturalWidth / image.naturalHeight;
										resizeMinimap();
									}}
								/>
								{#if $lineupForm.fromX !== null && $lineupForm.fromY !== null && $lineupForm.toX !== null && $lineupForm.toY !== null}
									<RenderEmptyLine
										fromCenter={[$lineupForm.fromX, $lineupForm.fromY]}
										toCenter={[$lineupForm.toX, $lineupForm.toY]}
										lineColor={data.gameInfo.grades[$lineupForm.grade]?.Color || '#FFFFFF'}
									/>
								{/if}
							</Clickable>
						{/if}
					</div>
				</div>
				<div class="grow flex flex-col select-overlay-mode justify-around ml-5">
					<input
						type="radio"
						form="none"
						id="from"
						name="fromto-mode"
						class="hidden"
						value={FromToMode.From}
						bind:group={selectedFromToMode}
					/>
					<label for="from" class="cursor-pointer">From</label>

					<input
						type="radio"
						form="none"
						id="to"
						name="fromto-mode"
						class="hidden"
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
						if (onMapPositionChange(e, 'from')) $lineupForm.from = null as unknown as number;
					}}
					bind:value={$lineupForm.from}
					aria-invalid={$lineupErrors.from ? 'true' : undefined}
				>
					{#if $lineupForm.map}
						<option hidden selected value={null}>- Select From Position -</option>
						{#if mapPositions[$lineupForm.map]}
							{#each Object.values(mapPositions[$lineupForm.map]) as mapPosition}
								<option value={mapPosition.ID}>{mapPosition.Callout}</option>
							{/each}
						{/if}
						<option value={ADD_MAP_POSITION_VALUE}>- Add Map Position -</option>
					{:else}
						<option selected value={null}>- Please select a Map. -</option>
					{/if}
				</select>
				<label for="from" class="error">
					{#if $lineupErrors.from}
						{$lineupErrors.from[0]}
					{/if}
				</label>

				<label for="to" class="main-label">To</label>
				<select
					name="to"
					onchange={(e) => {
						if (onMapPositionChange(e, 'to')) $lineupForm.to = null as unknown as number;
					}}
					bind:value={$lineupForm.to}
					aria-invalid={$lineupErrors.to ? 'true' : undefined}
				>
					{#if $lineupForm.map}
						<option hidden selected value={null}>- Select To Position -</option>
						{#if mapPositions[$lineupForm.map]}
							{#each Object.values(mapPositions[$lineupForm.map]) as mapPosition}
								<option value={mapPosition.ID}>{mapPosition.Callout}</option>
							{/each}
						{/if}
						<option value={ADD_MAP_POSITION_VALUE}>- Add Map Position -</option>
					{:else}
						<option selected value={null}>- Please select a Map. -</option>
					{/if}
				</select>
				<label for="to" class="error">
					{#if $lineupErrors.to}
						{$lineupErrors.to[0]}
					{/if}
				</label>

				{#snippet input(_for: 'fromX' | 'fromY' | 'toX' | 'toY', text: string)}
					<label for={_for} class="main-label">{text}</label>
					<input
						type="number"
						name={_for}
						bind:value={$lineupForm[_for]}
						placeholder="0"
						min="0"
						max="100"
						step="0.01"
						aria-invalid={$lineupErrors[_for] ? 'true' : undefined}
					/>
					<label for={_for} class="error">
						{#if $lineupErrors[_for]}
							{$lineupErrors[_for][0]}
						{/if}
					</label>
				{/snippet}

				{@render input('fromX', 'From (X-axis)')}
				{@render input('fromY', 'From (Y-axis)')}
				{@render input('toX', 'To (X-axis)')}
				{@render input('toY', 'To (Y-axis)')}

				<div class="mt-auto mb-8 h-20 flex flex-col">
					<button
						type="submit"
						name="confirm"
						class="m-auto px-16 py-6 rounded-lg bg-green-900 text-white font-bold text-4xl"
						>Confirm</button
					>
					<label
						for="confirm"
						class:error={!isEmpty($lineupErrors)}
						class:success={isEmpty($lineupErrors)}
					>
						{#if $lineupMessage}
							{$lineupMessage}
						{/if}
						{JSON.stringify($lineupErrors)}
					</label>
				</div>
			</div>
		</section>
	</form>
</main>

<Popup title="Add new position">
	<div class="h-full w-full flex">
		<form
			action="?/addMapPosition"
			class="main-form w-1/2 p-12 pr-6"
			method="post"
			use:mapPositionEnhance
		>
			<input type="text" name="map" class="hidden" value={$lineupForm.map} />
			<div class="flex p-12 w-full h-full bg-sky-200 rounded-lg">
				<div class="flex flex-col m-auto p-6 w-full">
					<input type="hidden" name="mapID" bind:value={$mapPositionForm.mapID} />

					<label for="callout" class="main-label">
						Callout
						{#if $mapPositionForm.mapID}
							({data.gameInfo.maps[$mapPositionForm.mapID].Name})
						{/if}
					</label>
					<input
						type="text"
						name="callout"
						placeholder="New Map Position"
						bind:value={$mapPositionForm.callout}
						aria-invalid={$mapPositionErrors.callout || $mapPositionErrors.mapID
							? 'true'
							: undefined}
					/>
					<label
						for="callout"
						class:error={!isEmpty($mapPositionErrors)}
						class:success={isEmpty($mapPositionErrors)}
					>
						{#if $mapPositionErrors.callout}
							{$mapPositionErrors.callout[0]}
						{/if}
						{#if $mapPositionErrors.callout && $mapPositionErrors.mapID}
							<br />
						{/if}
						{#if $mapPositionErrors.mapID}
							{$mapPositionErrors.mapID[0]}
						{/if}
						{#if $mapPositionMessage}
							{$mapPositionMessage.message}
						{/if}
					</label>
					<button
						type="submit"
						class="py-4 px-12 mt-12 text-lg font-bold rounded-lg bg-blue-200 mx-auto"
					>
						Add
					</button>
				</div>
			</div>
		</form>

		<form
			action="?/deleteMapPosition"
			id="deleteMapPosition"
			class="w-1/2 flex flex-col p-12 pl-6"
			method="post"
			use:mapPositionDeleteEnhance
		>
			<div class="w-full h-full p-12 bg-green-200 rounded-lg flex flex-col">
				<h1 class="font-bold text-2xl">Unused Map Positions</h1>
				<label
					for="deleteMapPosition"
					class="block"
					class:error={!isEmpty($mapPositionDeleteErrors)}
					class:success={isEmpty($mapPositionDeleteErrors)}
				>
					{#if $mapPositionDeleteErrors.mapPositionID}
						{$mapPositionDeleteErrors.mapPositionID[0]}
					{/if}
					{#if $mapPositionDeleteMessage}
						{$mapPositionDeleteMessage.message}
					{/if}
				</label>
				{#if Object.values(mapPositions[$mapPositionForm.mapID] ?? []).some((pos) => !pos.IsUsed)}
					<div class=" h-max-full overflow-y-auto mt-2">
						<table class="delete-map-position-table">
							<tbody>
								{#each Object.values(mapPositions[$mapPositionForm.mapID] ?? []).filter((pos) => !pos.IsUsed) as mapPosition (mapPosition.ID)}
									<tr>
										<td class="w-full py-2 px-8">{mapPosition.Callout}</td>
										<td class="p-2">
											<button
												type="submit"
												name="mapPositionID"
												value={mapPosition.ID}
												aria-label="delete"
											>
												<i class="fa-solid fa-trash"></i>
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<img src={emptyBox} alt="empty box" class="w-full h-full object-contain" />
				{/if}
			</div>
		</form>
	</div>
</Popup>

<style lang="postcss">
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
	}

	.delete-map-position-table {
		&,
		& td {
			border: 0.2rem solid black;
		}
	}
</style>
