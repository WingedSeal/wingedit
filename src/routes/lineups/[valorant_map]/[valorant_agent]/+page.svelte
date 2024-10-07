<script lang="ts">
	import LineupList from './LineupList.svelte';

	export let data;
</script>

Agent Name: {data.valorant.agent}
<br />
Map: {data.valorant.map}
<br />
Lineups:
<LineupList lineups={data.lineups} />
<div class="h-[100vh] bg-red-300"></div>
