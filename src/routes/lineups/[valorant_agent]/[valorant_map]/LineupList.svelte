<script lang="ts">
	import { type LineupInfo } from './types';
	export let lineups: LineupInfo[];
</script>

{#each lineups as lineup_info, i}
	<li>
		{i + 1}.{')'}
		UUID: {lineup_info.id}, grade: {lineup_info.grade}, from {lineup_info.throw_location}, to {lineup_info.land_location}
	</li>
{/each}
