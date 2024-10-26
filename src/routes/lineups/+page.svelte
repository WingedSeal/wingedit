<script lang="ts">
	import { goto } from '$app/navigation';
	import SelectAgent from './SelectAgent.svelte';
	import SelectMap from './SelectMap.svelte';
	import { selectedAgent, selectedMap } from './stores';
	let { data } = $props();
</script>

<div class="flex">
	<div class="max-w-[30%] h-[100dvh] bg-purple-500 p-8 flex flex-col">
		<SelectAgent agents={data.agents} />
	</div>
	<div class="flex-grow flex flex-col">
		AGENT + MAP IMAGE HERE

		<button
			class="bg-green-900 enabled:bg-green-300 mt-auto mx-auto mb-4 py-4 px-16"
			disabled={!$selectedAgent || !$selectedMap}
			onclick={() => {
				goto(
					`/lineups/${data.agents[$selectedAgent].Name.toLowerCase()}/${data.maps[$selectedMap].Name.toLowerCase()}`
				);
			}}
		>
			SELECT
		</button>
	</div>
	<div class="max-w-[30%] h-[100dvh] bg-purple-500 p-8 flex flex-col">
		<SelectMap maps={data.maps} />
	</div>
	``
</div>
