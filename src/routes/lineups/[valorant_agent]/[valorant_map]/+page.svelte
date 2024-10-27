<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import type { PageData } from './$types';
	import LineupList from './LineupList.svelte';
	import LineupShow from './LineupShow.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let isPopupHidden = $state(true);
	let lineupIndex = $state(0);
</script>

<section class="h-dvh bg-slate-200 flex">
	<div class="bg-green-300 flex-grow flex flex-col relative h-full">
		<div
			class="absolute right-0 bottom-0 h-full bg-yellow-100 aspect-[2/3] bg-no-repeat bg-cover bg-center"
			style="background-image: url('/api/image/agents/{data.valorant.agent.ID}/full.webp');"
		></div>
		<div class="bg-blue-200 h-2/3 min-w-[15%] max-w-[30%] mt-12 ml-12 z-10"></div>
		<div class="bg-blue-400 h-[10%] w-96 ml-12 mt-4 z-10"></div>
		<div class="bg-blue-400 h-[10%] w-[48rem] ml-12 mt-4 mb-2 z-10"></div>
	</div>
	<div class="bg-slate-500 h-full">
		<img src="/api/image/maps/{data.valorant.map.ID}/minimap.webp" class="h-full" alt="" />
	</div>
</section>

<!-- Agent Name: {data.valorant.agent.Name}
<br />
Map: {data.valorant.map.Name}
<br />
Lineups:
<LineupList lineups={data.lineups} gameInfo={data.gameInfo} bind:isPopupHidden bind:lineupIndex />

<div class="h-[100vh] bg-red-300"></div> -->

<!-- {#if data.lineups.length > 0}
	<Popup title={`TITLE`} bind:is_hidden={isPopupHidden}
		><LineupShow lineup={data.lineups[lineupIndex]} gameInfo={data.gameInfo} /></Popup
	>
{/if} -->
