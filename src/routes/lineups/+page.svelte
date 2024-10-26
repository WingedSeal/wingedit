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
	<div class="flex-grow flex flex-col relative">
		<div
			class="absolute bg-cover bg-no-repeat bg-center w-full h-full -z-10 after:content-['']
			after:absolute after:w-full after:h-full after:backdrop-blur-sm after:backdrop-brightness-75"
			style={$selectedMap
				? `background-image: url("/api/image/maps/${$selectedMap}/bg.webp");`
				: `background-image: url("/api/image/maps/default-bg.webp");`}
		></div>
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

	<div class="max-w-[20%] w-80 h-[100dvh] bg-purple-500 p-8 flex flex-col">
		<SelectMap maps={data.maps} />
	</div>
	``
</div>
