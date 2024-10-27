<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import type { PageData } from './$types';
	import Abilities from './Abilities.svelte';
	import LineupList from './LineupList.svelte';
	import LineupShow from './LineupShow.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let lineupIndex = $state(0);
	let lineupList = $derived(Object.values(data.lineups).flat());
	let selectedAbilityID = $state(0);
	let lineup = $derived(lineupList[lineupIndex]);
</script>

<main class="snap-mandatory snap-y h-dvh overflow-y-auto">
	<section class="h-dvh bg-slate-200 flex snap-center">
		<div class="bg-green-300 flex-grow flex flex-col relative h-full">
			<div
				class="absolute right-0 bottom-0 h-full bg-yellow-100 aspect-[2/3] bg-no-repeat bg-cover bg-center"
				style="background-image: url('/api/image/agents/{data.valorant.agent.ID}/full.webp');"
			></div>
			<div class="bg-blue-200 min-w-[15%] max-w-full mr-auto mb-auto mt-12 ml-12 z-10">
				<Abilities abilities={data.abilities} />
			</div>
			<div class="bg-blue-400 h-[10%] w-96 ml-12 mt-4 z-10"></div>
			<div class="bg-blue-400 h-[10%] w-[48rem] ml-12 mt-4 mb-4 z-10"></div>
		</div>
		<div class="bg-slate-500 h-full">
			<img
				src="/api/image/maps/{data.valorant.map.ID}/minimap.webp"
				class="h-full"
				alt="minimap.webp"
			/>
		</div>
	</section>
	<section class="h-dvh bg-slate-200 flex flex-col p-16 snap-center">
		<div class="flex flex-col overflow-auto max-h-full p-4">
			<LineupList
				lineups={lineupList}
				gameInfo={data.gameInfo}
				abilities={data.abilities}
				bind:lineupIndex
			/>
		</div>
	</section>
</main>

{#if lineup}
	<Popup
		title="{data.gameInfo.sides[lineup.SideID].Name}: {data.gameInfo.mapPositions[lineup.MapID][
			lineup.FromMapPositionID
		].Callout} to {data.gameInfo.mapPositions[lineup.MapID][lineup.ToMapPositionID].Callout}"
	>
		<LineupShow {lineup} gameInfo={data.gameInfo} />
	</Popup>
{/if}
