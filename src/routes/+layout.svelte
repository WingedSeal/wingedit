<script lang="ts">
	import '../app.css';
	import initWorker from '$lib/sqlite/loadWorker';
	import { onMount } from 'svelte';
	onMount(() => {
		initWorker();
	});
</script>

<slot />
