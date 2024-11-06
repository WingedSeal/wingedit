<script lang="ts">
	import type { Ability } from '$lib/server/db/types';

	type Props = {
		abilities: Ability[];
		selectedAbilityID: number | null;
	};
	let { abilities, selectedAbilityID = $bindable() }: Props = $props();
</script>

<div class="flex flex-col gap-4 max-h-full overflow-y-auto overflow-x-clip pr-10">
	{#each abilities as ability (ability.AbilityID)}
		<button
			class="flex flex-row bg-purple-500 p-4 {selectedAbilityID === ability.AbilityID
				? 'translate-x-12'
				: ''}"
			onclick={() => {
				selectedAbilityID = ability.AbilityID;
			}}
		>
			<img
				class="w-20 h-20"
				src="/api/image/agents/{ability.AgentID}/abilities/{ability.AbilityID}.webp"
				alt={ability.Name}
			/>

			<span class="text-4xl ml-2 font-bold self-end text-slate-100">{ability.Name}</span>
		</button>
	{/each}
</div>
