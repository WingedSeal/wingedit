<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import type { PageData } from './$types';
	import LineupList from './LineupList.svelte';
	import LineupShow from './LineupShow.svelte';
	export let data: PageData;
	let is_popup_hidden: boolean;
	let lineup = data.lineups[0];
</script>

Agent Name: {data.valorant.agent.Name}
<br />
Map: {data.valorant.map.Name}
<br />
Lineups:
<LineupList lineups={data.lineups} />
<button
	class="w-10 h-10 bg-violet-800"
	on:click={() => {
		is_popup_hidden = !is_popup_hidden;
	}}
></button>

<div class="h-[100vh] bg-red-300"></div>
<Popup title={`TITLE`} bind:is_hidden={is_popup_hidden}
	><LineupShow {lineup} gameInfo={data.game_info} /></Popup
>
