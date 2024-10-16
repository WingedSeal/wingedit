<script lang="ts">
	import type { Lineup } from '$lib/server/db/types';

	export let lineups: Lineup[];
</script>

{#each lineups as lineup_info, i}
	<li>
		{i + 1}.{')'}
		UUID: {lineup_info.UUID}, grade: {lineup_info.GradeID}
	</li>
{/each}
