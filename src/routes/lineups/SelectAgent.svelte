<script lang="ts">
	import type { Agent } from '$lib/server/db/types';
	import { onMount } from 'svelte';
	import AgentDisplay from './AgentDisplay.svelte';
	import {
		getFavouriteAgentIDs,
		getMainAgentID,
		selectedAgent,
		updateFavouriteAgentIDs,
		updateMainAgentID
	} from './stores';

	interface Props {
		agents: {
			[agentID: number]: Agent;
		};
	}

	let { agents }: Props = $props();
	let mainAgent = $state<Agent | null>(null);
	let favouriteAgents = $state<Agent[]>([]);
	let otherAgents = $state<Agent[]>([]);

	let modeSelect = $state('default');
	// svelte-ignore non_reactive_update
	let agentSearch = '';
	let favouriteAgentIDs = getFavouriteAgentIDs();
	let mainAgentID = getMainAgentID();

	const sort = () => {
		mainAgent = null;
		favouriteAgents = [];
		otherAgents = [];
		Object.values(agents).forEach((agent) => {
			if (!agent.Name.toLowerCase().includes(agentSearch.toLowerCase())) return;
			if ($mainAgentID === agent.ID) {
				mainAgent = agent;
			} else if ($favouriteAgentIDs.has(agent.ID)) {
				favouriteAgents.push(agent);
			} else {
				otherAgents.push(agent);
			}
		});
	};
	onMount(() => {
		updateFavouriteAgentIDs(favouriteAgentIDs);
		updateMainAgentID(mainAgentID);
		$selectedAgent = $mainAgentID;
		sort();
	});
</script>

<div class="w-full flex flex-row bg-green-500 my-4">
	<input
		type="text"
		oninput={sort}
		bind:value={agentSearch}
		class="w-2/3 rounded-lg p-2 mr-2 h-full"
		placeholder="Search Agent..."
	/>
	<select
		class="w-1/3 h-full my-auto rounded-lg mx-auto block"
		bind:value={modeSelect}
		onchange={sort}
	>
		<option value="default">default</option>
		<option value="">favourite</option>
	</select>
</div>
<div class="bg-blue-400 flex overflow-y-scroll mb-2 flex-grow">
	<div class="bg-blue-200 agent-grid w-full mb-auto">
		{#if mainAgent}
			<AgentDisplay agent={mainAgent} {favouriteAgentIDs} isMain />
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
</div>
<button
	class="mt-auto bg-yellow-200 disabled:bg-yellow-900 mx-auto py-4 px-12"
	onclick={() => {
		if ($mainAgentID === $selectedAgent) {
			$mainAgentID = 0;
		} else {
			$mainAgentID = $selectedAgent;
			favouriteAgentIDs.add($selectedAgent);
		}
		sort();
	}}
	disabled={$selectedAgent === 0}
>
	{$mainAgentID !== $selectedAgent || $selectedAgent === 0
		? 'Select Main Agent'
		: 'Deselect Main Agent'}
</button>

<style lang="scss">
	.agent-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 6rem);
		justify-content: space-between;
		grid-gap: 1rem;
	}
</style>
