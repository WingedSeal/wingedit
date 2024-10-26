<script lang="ts">
	import type { Agent } from '$lib/server/db/types';
	import { untrack } from 'svelte';
	import AgentDisplay from './AgentDisplay.svelte';
	import { selectedAgent, type FavouriteAgentID } from './stores';

	interface Props {
		mainAgentID: number;
		favouriteAgentIDs: FavouriteAgentID;
		agents: {
			[agentID: number]: Agent;
		};
	}

	let { mainAgentID, favouriteAgentIDs, agents }: Props = $props();
	let mainAgent = $state<Agent | null>(null);
	let favouriteAgents = $state<Agent[]>([]);
	let otherAgents = $state<Agent[]>([]);

	let agentSearch = $state('');
	let modeSelect = $state('default');

	const sort = () => {
		mainAgent = null;
		favouriteAgents = [];
		otherAgents = [];
		Object.values(agents).forEach((agent) => {
			if (!agent.Name.toLowerCase().includes(agentSearch.toLowerCase())) return;
			if (mainAgentID === agent.ID) {
				mainAgent = agent;
			} else if ($favouriteAgentIDs.has(agent.ID)) {
				favouriteAgents.push(agent);
			} else {
				otherAgents.push(agent);
			}
		});
	};

	$effect(() => {
		agentSearch;
		untrack(sort);
	});
</script>

<button onclick={() => sort()}>WAT</button>

<div class="w-full flex flex-row bg-green-500 my-4">
	<input
		type="text"
		bind:value={agentSearch}
		class="w-2/3 rounded-lg p-2 mr-2 h-full"
		placeholder="Search Agent..."
	/>
	<select
		class="w-1/3 h-full my-auto rounded-lg mx-auto block"
		bind:value={modeSelect}
		onchange={() => {
			sort();
		}}
	>
		<option value="default">default</option>
		<option value="">favourite</option>
	</select>
</div>
<div class="bg-blue-400 agent-grid">
	{#if mainAgent && modeSelect}
		<AgentDisplay agent={mainAgent} {favouriteAgentIDs} cantFavourite />
	{/if}
	{#each favouriteAgents as agent (agent.ID)}
		<AgentDisplay {agent} {favouriteAgentIDs} isFavourite />
	{/each}
	{#if modeSelect}
		{#each otherAgents as agent (agent.ID)}
			<AgentDisplay {agent} {favouriteAgentIDs} />
		{/each}
	{/if}
</div>

<style lang="scss">
	.agent-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 6rem);
		justify-content: space-between;
		grid-gap: 1rem;
	}
</style>
