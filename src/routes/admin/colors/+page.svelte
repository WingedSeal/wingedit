<script lang="ts">
	import { dev } from '$app/environment';
	import Page from './Page.svelte';
</script>

{#if dev}
	<Page />
{/if}
