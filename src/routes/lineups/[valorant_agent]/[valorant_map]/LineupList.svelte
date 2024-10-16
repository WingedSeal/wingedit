<script lang="ts">
	import type { Lineup } from '$lib/server/db/types';

	export let lineups: Lineup[];
</script>

{#each lineups as lineup, i}
	<li>
		{i + 1}.{')'}
		UUID: {lineup.UUID}, grade: {lineup.GradeID}
	</li>
{/each}
