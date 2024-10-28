<script lang="ts">
	import type { Ability } from '$lib/server/db/types';

	type Props = {
		abilities: Ability[];
		selectedAbilityID: number;
	};
	let { abilities, selectedAbilityID = $bindable() }: Props = $props();
</script>

<div class="flex flex-col gap-4 z-10">
	{#each abilities as ability}
		<button
			class="flex flex-row bg-purple-500 p-4 {selectedAbilityID === ability.AbilityID
				? 'translate-x-12'
				: ''}"
			onclick={() => {
				selectedAbilityID = ability.AbilityID;
			}}
		>
			<img
				class="w-24 h-24"
				src="/api/image/agents/{ability.AgentID}/abilities/{ability.AbilityID}.webp"
				alt={ability.NameID}
			/>

			<span class="text-5xl ml-2 font-bold self-end text-slate-100">{ability.Name}</span>
		</button>
	{/each}
</div>
