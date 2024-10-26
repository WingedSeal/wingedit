<script lang="ts">
	import SelectAgent from './SelectAgent.svelte';
	let { data } = $props();
</script>

<div class="max-w-[30%] h-[100dvh] bg-purple-500 p-8 flex flex-col">
	<SelectAgent agents={data.agents} />
</div>
``
