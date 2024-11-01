<script lang="ts">
	import type { Side } from '$lib/server/db/types';
	import type { Writable } from 'svelte/store';

	type Props = {
		sides: Side[];
		filterdOutSideIDs: Writable<Set<number>>;
	};
	let { sides, filterdOutSideIDs = $bindable() }: Props = $props();
</script>

<div class="flex flex-row gap-4 max-h-full">
	{#each sides as side}
		<button
			class="flex flex-row p-4 aspect-square {!$filterdOutSideIDs.has(side.ID)
				? 'bg-blue-800'
				: 'bg-blue-500'}"
			onclick={() => {
				if ($filterdOutSideIDs.has(side.ID)) {
					filterdOutSideIDs.update((filterdOutSideIDs) => {
						filterdOutSideIDs.delete(side.ID);
						return filterdOutSideIDs;
					});
				} else {
					filterdOutSideIDs.update((filterdOutSideIDs) => {
						filterdOutSideIDs.add(side.ID);
						return filterdOutSideIDs;
					});
				}
			}}
		>
			<span class="text-4xl font-bold self-end text-slate-100 m-auto text-center">{side.Name}</span>
		</button>
	{/each}
</div>
