<script lang="ts">
	import Popup from '$lib/Popup.svelte';
	import LineupList from './LineupList.svelte';
	import LineupShow from './LineupShow.svelte';
	export let data;
	let is_popup_hidden: boolean;
	let lineup = data.lineups[0];
</script>

Agent Name: {data.valorant.agent}
<br />
Map: {data.valorant.map}
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
<Popup title={`${lineup.throw_location} - ${lineup.land_location}`} bind:is_hidden={is_popup_hidden}
	><LineupShow lineup_info={lineup} map={data.valorant.map} agent={data.valorant.agent} /></Popup
>
