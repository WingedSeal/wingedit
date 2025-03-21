<script lang="ts">
	import colors from '$lib/colors';
	import type { Side } from '$lib/server/db/types';
	import type { Writable } from 'svelte/store';

	type Props = {
		sides: Side[];
		filteredOutSideIDs: Writable<Set<number>>;
	};
	let { sides, filteredOutSideIDs = $bindable() }: Props = $props();
</script>

<div class="flex flex-row gap-4 max-h-full">
	{#each sides as side (side.ID)}
		<button
			class="flex flex-row p-4 transition border-transparent border-4 ease-in-out hover:-translate-y-1
				active:translate-y-1 duration-150 rounded-xl {$filteredOutSideIDs.has(side.ID)
				? 'bg-secondary'
				: 'bg-secondary-dark border-corner'}"
			style="--c: {colors['plain-dark']};"
			onclick={() => {
				if ($filteredOutSideIDs.has(side.ID)) {
					filteredOutSideIDs.update((filteredOutSideIDs) => {
						filteredOutSideIDs.delete(side.ID);
						return filteredOutSideIDs;
					});
				} else {
					filteredOutSideIDs.update((filteredOutSideIDs) => {
						filteredOutSideIDs.add(side.ID);
						return filteredOutSideIDs;
					});
				}
			}}
		>
			<span class="text-4xl font-bold self-end text-plain-dark m-auto text-center">{side.Name}</span
			>
		</button>
	{/each}
</div>
