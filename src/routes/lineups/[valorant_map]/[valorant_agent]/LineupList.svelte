<script lang="ts">
	import LineupShow from './LineupShow.svelte';
	import { type LineupInfo } from './Lineup';
	import Popup from '$lib/Popup.svelte';
	export let lineups: LineupInfo[];
	let is_popup_hidden: boolean;
</script>

{#each lineups as lineup_info, i}
	<li>
		{i + 1}.{')'}
		UUID: {lineup_info.id}, grade: {lineup_info.grade}, from {lineup_info.throw_location}, to {lineup_info.land_location}
	</li>
{/each}
<button
	class="w-10 h-10 bg-violet-800"
	on:click={() => {
		is_popup_hidden = !is_popup_hidden;
	}}
></button>

<Popup title="TITLE" bind:is_hidden={is_popup_hidden}><LineupShow /></Popup>
