<script lang="ts">
	import type { Agent } from '$lib/server/db/types';
	import { onMount, untrack } from 'svelte';
	import AgentDisplay from './AgentDisplay.svelte';
	import {
		FAVOURITE_AGENT_LOCAL_STORAGE,
		MAIN_AGENT_LOCAL_STORAGE,
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
<div class="bg-blue-400 agent-grid overflow-y-auto mb-2">
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
<button
	class="mt-auto bg-yellow-200 mx-auto py-4 px-12"
	onclick={() => {
		$mainAgentID = $selectedAgent;
		favouriteAgentIDs.add($selectedAgent);
		sort();
	}}>Main Agent</button
>

<style lang="scss">
	.agent-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 6rem);
		justify-content: space-between;
		grid-gap: 1rem;
	}
</style>
