<script lang="ts">
	import LineupList from "./LineupList.svelte";

	export let data;
</script>

{data.valorant.agent} + {data.valorant.map}
<LineupList lineups={data.lineups} />