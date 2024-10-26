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

Agent Name: {data.valorant.agent.Name}
<br />
Map: {data.valorant.map.Name}
<br />
Lineups:
<LineupList lineups={data.lineups} gameInfo={data.gameInfo} bind:isPopupHidden bind:lineupIndex />

<div class="h-[100vh] bg-red-300"></div>

{#if data.lineups.length > 0}
	<Popup title={`TITLE`} bind:is_hidden={isPopupHidden}
		><LineupShow lineup={data.lineups[lineupIndex]} gameInfo={data.gameInfo} /></Popup
	>
{/if}
