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
			class="aspect-video bg-red-300 w-full {$selectedMap === map.ID ? 'bg-red-700' : 'bg-red-300'}"
			onclick={() => {
				$selectedMap = map.ID;
			}}
		>
			{maps[map.ID].Name}
		</button>
	{/each}
</div>
