<script lang="ts">
	import Lineup from '$lib/components/forms/Lineup.svelte';
	const { data } = $props();
</script>

<Lineup _data={data} />
