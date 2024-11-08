<script lang="ts">
	import { goto } from '$app/navigation';
	import SelectAgent from './SelectAgent.svelte';
	import SelectMap from './SelectMap.svelte';
	import { selectedAgent, selectedMap } from './stores';
	let { data } = $props();
</script>

<div class="flex h-dvh-nav">
	<div class="w-[30%] min-w-[22%] bg-primary p-8 flex flex-col">
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
		{#if $selectedAgent}
			<!-- <h2
				class="uppercase text-[10rem] text-slate-100 font-bold top-1/4 left-1/2 -translate-x-1/2 absolute z-10"
			>
				{data.agents[$selectedAgent].Name}
			</h2> -->
			<img
				class="absolute h-full left-1/2 -translate-x-1/2"
				src="/api/image/agents/{$selectedAgent}/full.webp"
				alt={data.agents[$selectedAgent].Name}
			/>
		{/if}
		<button
			class="bg-green-900 enabled:bg-green-300 text-plain-dark text-3xl mt-auto mx-auto mb-4 py-4 px-16 z-10 rounded-3xl font-bold"
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

	<div class="max-w-[20%] w-80 h-full bg-secondary p-8 flex flex-col">
		<SelectMap maps={data.maps} />
	</div>
</div>
