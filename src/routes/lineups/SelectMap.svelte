<script lang="ts">
	import type { ValorantMap } from '$lib/server/db/types';
	import { selectedMap } from './stores';

	interface Props {
		maps: {
			[mapID: number]: ValorantMap;
		};
	}
	const { maps }: Props = $props();
	let mapSearch = $state('');
	const mapsList = $derived(
		Object.values(maps).filter((map) => map.Name.toLowerCase().includes(mapSearch.toLowerCase()))
	);
</script>

<input
	type="text"
	class="w-full rounded-lg p-2 my-4 mx-auto"
	bind:value={mapSearch}
	placeholder="Search Map..."
/>
<div class="bg-blue-400 agent-grid overflow-y-scroll mb-2 flex flex-col gap-4 flex-grow">
	{#each mapsList as map (map.ID)}
		<button
			class="flex rounded-lg aspect-video relative bg-black w-full {$selectedMap === map.ID
				? 'border-8 border-white'
				: ''}"
			onclick={() => {
				$selectedMap = map.ID;
			}}
		>
			<img
				class="rounded-lg w-full h-full"
				src="/api/image/maps/{map.ID}/bg.webp"
				alt="bg.webp"
				draggable="false"
			/>
			<h2
				class="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-3xl uppercase font-bold text-slate-100"
			>
				{maps[map.ID].Name}
			</h2>
		</button>
	{/each}
</div>
