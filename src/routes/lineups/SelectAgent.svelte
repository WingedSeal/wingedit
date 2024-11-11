<script lang="ts">
	import type { Agent } from '$lib/server/db/types';
	import AgentDisplay from './AgentDisplay.svelte';
	import {
		getFavouriteAgentIDs,
		getMainAgentID,
		selectedAgent,
		updateFavouriteAgentIDs,
		updateMainAgentID
	} from './stores';
	import { afterNavigate } from '$app/navigation';
	import ToolTip from '$lib/components/ToolTip.svelte';

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
	afterNavigate(() => {
		updateFavouriteAgentIDs(favouriteAgentIDs);
		updateMainAgentID(mainAgentID);
		$selectedAgent = $mainAgentID;
		sort();
	});
</script>

<div class="w-full flex flex-row my-4">
	<input
		type="text"
		oninput={sort}
		bind:value={agentSearch}
		class="w-2/3 rounded-lg p-2 mr-2 h-full bg-primary-dark text-plain-light placeholder:text-plain-light placeholder:opacity-70"
		placeholder="Search Agent..."
	/>
	<select
		class="w-1/3 h-full my-auto rounded-lg mx-auto block text-plain-light bg-primary-dark"
		bind:value={modeSelect}
		onchange={sort}
	>
		<option value="default">Default</option>
		<option value="">Favourite</option>
	</select>
</div>
<div class=" flex overflow-y-scroll mb-2 flex-grow border-4 rounded border-primary-dark p-2">
	<div class=" agent-grid w-full mb-auto">
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
	class="mt-auto bg-primary-dark text-plain-light rounded-3xl disabled:bg-primary-contrast mx-auto py-4 px-12"
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
	<span class="mx-auto relative block text-xl">
		{$mainAgentID !== $selectedAgent || $selectedAgent === 0
			? 'Select Main Agent'
			: 'Deselect Main Agent'}
		<div class="absolute -right-1 top-1/2 translate-x-full -translate-y-1/2 pb-[0.1rem]">
			<ToolTip direction="right">Automatically select this agent upon visit.</ToolTip>
		</div>
	</span>
</button>

<style lang="scss">
	.agent-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 6rem);
		justify-content: space-around;
		grid-gap: 1rem;
	}
</style>
