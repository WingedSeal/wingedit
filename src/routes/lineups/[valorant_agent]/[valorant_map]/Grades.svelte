<script lang="ts">
	import type { Grade } from '$lib/server/db/types';
	import type { Writable } from 'svelte/store';

	type Props = {
		grades: Grade[];
		filterdOutGradeIDs: Writable<Set<number>>;
	};
	let { grades, filterdOutGradeIDs = $bindable() }: Props = $props();
</script>

<div class="flex flex-row gap-4 max-h-full">
	{#each grades as grade}
		<button
			class="flex flex-row p-4 aspect-square {!$filterdOutGradeIDs.has(grade.ID)
				? 'bg-primary-dark rounded-lg'
				: 'bg-primary-contrast rounded-lg'}"
			onclick={() => {
				if ($filterdOutGradeIDs.has(grade.ID)) {
					filterdOutGradeIDs.update((filterdOutGradeIDs) => {
						filterdOutGradeIDs.delete(grade.ID);
						return filterdOutGradeIDs;
					});
				} else {
					filterdOutGradeIDs.update((filterdOutGradeIDs) => {
						filterdOutGradeIDs.add(grade.ID);
						return filterdOutGradeIDs;
					});
				}
			}}
		>
			<span
				class="text-4xl font-bold self-end text-slate-100 m-auto text-center"
				style="color: {grade.Color};">{grade.Name}</span
			>
		</button>
	{/each}
</div>
