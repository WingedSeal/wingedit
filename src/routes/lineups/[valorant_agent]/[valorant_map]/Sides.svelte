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
	{#each sides as side (side.ID)}
		<button
			class="flex flex-row p-4 aspect-square transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-150 {!$filterdOutSideIDs.has(
				side.ID
			)
				? 'bg-secondary rounded-xl'
				: 'bg-secondary-dark rounded-xl'}"
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
			<span class="text-4xl font-bold self-end text-plain-dark m-auto text-center">{side.Name}</span
			>
		</button>
	{/each}
</div>
