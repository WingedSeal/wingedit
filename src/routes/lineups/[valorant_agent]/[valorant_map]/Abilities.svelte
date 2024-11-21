<script lang="ts">
	import type { Ability } from '$lib/server/db/types';

	type Props = {
		abilities: Ability[];
		selectedAbilityID: number | null;
	};
	let { abilities, selectedAbilityID = $bindable() }: Props = $props();
</script>

<div class="flex flex-col gap-4 max-h-full overflow-y-auto overflow-x-clip pr-10 w-max">
	{#each abilities as ability (ability.AbilityID)}
		<button
			class="mr-4 flex flex-row bg-gradient-to-r from-primary-contrast from-30% to-primary rounded-xl p-4 pr-10 transition-transform duration-75 {selectedAbilityID ===
			ability.AbilityID
				? 'translate-x-12'
				: ''}"
			onclick={() => {
				selectedAbilityID = ability.AbilityID;
			}}
		>
			<img
				class="w-16 h-16"
				src="/api/image/agents/{ability.AgentID}/abilities/{ability.AbilityID}.webp"
				alt={ability.Name}
			/>

			<span class="text-4xl ml-2 font-bold self-end text-slate-100 text-center">{ability.Name}</span
			>
		</button>
	{/each}
</div>
