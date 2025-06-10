<script lang="ts">
	import { page } from '$app/stores';
	import LoadingScreen, { isLoaded } from '$lib/components/LoadingScreen.svelte';
	import Popup, { isPopupShow } from '$lib/components/Popup.svelte';
	import Privilege from '$lib/privilege';
	import { timeAgoString } from '$lib/utils';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { PageData } from './$types';
	import Abilities from './Abilities.svelte';
	import Grades from './Grades.svelte';
	import RenderLine from './LineupLineOverlay.svelte';
	import LineupList from './LineupList.svelte';
	import LineupShow from './LineupShow.svelte';
	import Sides from './Sides.svelte';
	import { isFullScreenImage } from './stores';
	import FullscreenImage from './FullscreenImage.svelte';
	import LineupShowOverlay from '$lib/components/LineupShowOverlay.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const allLineupList = Object.values(data.lineups).flat();

	let selectedAbilityID = $state<number | null>(null);
	let filteredOutGradeIDs: Writable<Set<number>> = $state(writable(new Set()));
	let filteredOutSideIDs: Writable<Set<number>> = $state(writable(new Set()));
	const lineupList = $derived(
		allLineupList
			.map((v, i) => {
				return { index: i, lineup: v };
			})
			.filter(
				({ lineup }) =>
					selectedAbilityID === lineup.AbilityID &&
					!$filteredOutGradeIDs.has(lineup.GradeID) &&
					!$filteredOutSideIDs.has(lineup.SideID)
			)
	);

	let lineupParam = parseInt($page.url.searchParams.get('lineup') || '') || null;

	let lineupIndex = $state(
		lineupParam ? allLineupList.findIndex((lineup) => lineup.ID === lineupParam) : 0
	);
	if (lineupParam) {
		$isPopupShow = true;
		// svelte-ignore state_referenced_locally
		selectedAbilityID = allLineupList[lineupIndex].AbilityID;
	}
	let selectedLineup = $derived(allLineupList[lineupIndex]);
	$isLoaded = false;

	onMount(() => {
		const unsubscribe = isPopupShow.subscribe((isShow) => {
			if (isShow) {
				history.replaceState({}, '', `${$page.url.pathname}?lineup=${selectedLineup.ID}`);
				// replaceState(`${$page.url.pathname}?lineup=${lineupIndex}`, {});
			} else {
				history.replaceState({}, '', $page.url.pathname);
				// replaceState($page.url.pathname, {});
			}
		});
		return unsubscribe;
	});
</script>

<LoadingScreen />
<main class="snap-mandatory snap-y h-dvh-nav overflow-y-auto">
	<section class="h-full bg-plain-light flex snap-center">
		<div class=" flex-grow flex flex-col relative h-full">
			<div
				class="absolute right-0 bottom-0 h-full aspect-[2/3] bg-no-repeat bg-cover bg-center"
				style="background-image: url('/api/image/agents/{data.valorant.agent.ID}/full.webp');"
			></div>
			<div class="w-full max-h-[60%] mr-auto mb-auto mt-12 ml-12 z-10">
				<Abilities abilities={Object.values(data.abilities)} bind:selectedAbilityID />
			</div>
			<div class=" max-h-[10%] max-w-[80%] ml-12 mt-4 mr-auto z-10">
				<Sides sides={Object.values(data.gameInfo.sides)} bind:filteredOutSideIDs />
			</div>
			<div class="w-full ml-12 mt-4 mr-auto z-10 mb-6">
				<Grades grades={Object.values(data.gameInfo.grades)} bind:filteredOutGradeIDs />
			</div>
		</div>
		<div class="bg-primary h-full p-1 relative">
			<div class="absolute w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] top-0 left-0 p-[inherit]">
				{#each lineupList as { lineup, index }}
					<RenderLine {lineup} grades={data.gameInfo.grades} {index} bind:lineupIndex />
				{/each}
			</div>
			<img
				src="/api/image/maps/{data.valorant.map.ID}/minimap.webp"
				class="h-full w-full min-w-max"
				alt="minimap.webp"
				onload={() => {
					$isLoaded = true;
				}}
			/>
		</div>
	</section>

	<section class="h-full bg-plain-light flex flex-col p-16 snap-center">
		<div class="flex flex-col overflow-auto max-h-full p-4">
			<LineupList
				lineups={allLineupList}
				gameInfo={data.gameInfo}
				abilities={data.abilities}
				bind:lineupIndex
			/>
		</div>
	</section>
</main>
{#snippet titleRight()}
	{#if data.user && (data.user.privilege >= Privilege.Moderator || selectedLineup.CreatedBy === data.user.id)}
		<a
			class="my-auto mr-8 ml-auto text-xl cursor-pointer"
			href="/edit/lineup/{selectedLineup.ID}"
			aria-label="close"
		>
			<i class="fa-regular fa-pen-to-square"></i>
		</a>
	{/if}
{/snippet}
{#if selectedLineup}
	<Popup
		title="({selectedLineup.ID}) {data.gameInfo.sides[selectedLineup.SideID].Name}: {data.gameInfo
			.mapPositions[selectedLineup.MapID][selectedLineup.FromMapPositionID].Callout} to {data
			.gameInfo.mapPositions[selectedLineup.MapID][selectedLineup.ToMapPositionID]
			.Callout} ({timeAgoString(selectedLineup.CreationTimestamp)})"
		{titleRight}
	>
		<LineupShow lineup={selectedLineup} gameInfo={data.gameInfo} />
	</Popup>
{/if}

{#snippet overlay()}
	<LineupShowOverlay
		DrawOverMainX={selectedLineup.DrawOverMainX}
		DrawOverMainY={selectedLineup.DrawOverMainY}
		DrawOverSub1X={selectedLineup.DrawOverSub1X}
		DrawOverSub1Y={selectedLineup.DrawOverSub1Y}
		DrawOverSub2X={selectedLineup.DrawOverSub2X}
		DrawOverSub2Y={selectedLineup.DrawOverSub2Y}
	/>
{/snippet}
{#if $isFullScreenImage}
	<FullscreenImage lineup={selectedLineup} {overlay} />
{/if}

<svelte:head>
	<title>{data.valorant.agent.Name} • {data.valorant.map.Name} - WingedIT</title>
	<meta name="description" content="Select your agent and map to search for lineups." />
</svelte:head>
