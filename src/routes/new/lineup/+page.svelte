<script lang="ts">
	import LineupForm from './LineupForm.svelte';

	const { data } = $props();
</script>

<LineupForm _data={data} />
