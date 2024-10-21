<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { Agent } from '$lib/server/db/types.js';

	export let data;
	const FAVOURITE_AGENT = 'favourite';
	const MAIN_AGENT = 'main';

	let favouriteAgents: Set<number> = new Set();
	if (browser && localStorage.getItem(FAVOURITE_AGENT)) {
		favouriteAgents = new Set(JSON.parse(localStorage.getItem(FAVOURITE_AGENT)!));
	}
	let mainAgent: number = 0;
	if (browser && localStorage.getItem(MAIN_AGENT)) {
		mainAgent = Number.parseInt(localStorage.getItem(MAIN_AGENT)!);
	}

	let chosenMap: number | null = null;
	let chosenAgent: number | null = mainAgent;
	let canSubmit = false;
	let submitText = '';
	$: canSubmit = !!chosenMap && !!chosenAgent;
	$: if (canSubmit) {
		submitText = 'SELECT';
	} else if (!chosenAgent) {
		submitText = 'Please choose an agent';
	} else {
		submitText = 'Please choose a map';
	}
	let agentSearch = '';
	let mapSearch = '';

	let mains: Agent[] = [];
	let favourites: Agent[] = [];
	let others: Agent[] = [];
	const getSorted = () => {
		mains = [];
		favourites = [];
		others = [];
		Object.values(data.agents).forEach((agent) => {
			if (!agent.Name.toLowerCase().includes(agentSearch.toLowerCase())) return;
			if (mainAgent === agent.ID) {
				mains.push(agent);
			} else if (favouriteAgents.has(agent.ID)) {
				favourites.push(agent);
			} else {
				others.push(agent);
			}
		});
	};
	getSorted();
	$: if (agentSearch) getSorted();
</script>

{#if data.user}
	You are signed in as {data.user.username}
{:else}
	You are not signed in
{/if}
AGENTS
<br />
<input type="text" placeholder="search" bind:value={agentSearch} />
<br />
{#each mains as agent}
	<div class="flex flex-col m-10">
		<button
			class={chosenAgent === agent.ID ? `bg-blue-300` : `bg-slate-100`}
			on:click={() => (chosenAgent = agent.ID)}>{agent.Name}</button
		>{' '}
		<button
			class="bg-red-400"
			on:click={() => {
				mainAgent = -1;
				getSorted();
				localStorage.setItem(MAIN_AGENT, mainAgent.toString());
			}}>MAIN</button
		>
	</div>
{/each}
{#each favourites as agent}
	<div class="flex flex-col m-10">
		<button
			class={chosenAgent === agent.ID ? `bg-blue-300` : `bg-slate-100`}
			on:click={() => (chosenAgent = agent.ID)}>{agent.Name}</button
		>{' '}
		<button
			class={favouriteAgents.has(agent.ID) ? ' bg-yellow-100' : ''}
			on:click={() => {
				favouriteAgents.delete(agent.ID);
				favouriteAgents = favouriteAgents;
				getSorted();
				localStorage.setItem(FAVOURITE_AGENT, JSON.stringify([...favouriteAgents]));
			}}>FAV</button
		>
		<button
			on:click={() => {
				mainAgent = agent.ID;
				getSorted();
				localStorage.setItem(MAIN_AGENT, mainAgent.toString());
			}}>MAIN</button
		>
	</div>
{/each}
{#each others as agent}
	<div class="flex flex-col m-10">
		<button
			class={chosenAgent === agent.ID ? `bg-blue-300` : `bg-slate-100`}
			on:click={() => (chosenAgent = agent.ID)}>{agent.Name}</button
		>{' '}
		<button
			on:click={() => {
				favouriteAgents.add(agent.ID);
				favouriteAgents = favouriteAgents;
				getSorted();
				localStorage.setItem(FAVOURITE_AGENT, JSON.stringify([...favouriteAgents]));
			}}>FAV</button
		>
		<button
			on:click={() => {
				mainAgent = agent.ID;
				getSorted();
				localStorage.setItem(MAIN_AGENT, mainAgent.toString());
			}}>MAIN</button
		>
	</div>
{/each}
MAPS
<br />
<input type="text" placeholder="search" bind:value={mapSearch} />
<br />
{#each Object.values(data.maps) as map}
	{#if map.Name.toLowerCase().includes(mapSearch.toLowerCase())}
		<button
			class={chosenMap === map.ID ? `bg-blue-300` : `bg-slate-100`}
			on:click={() => (chosenMap = map.ID)}>{map.Name}</button
		>{' '}
	{/if}
{/each}
<br />

<br /><br />
<button
	class="bg-amber-100"
	disabled={!canSubmit}
	on:click={() => {
		goto(
			'/lineups/' +
				// @ts-ignore
				data.agents[chosenAgent].Name.toLowerCase() +
				'/' +
				// @ts-ignore
				data.maps[chosenMap].Name.toLowerCase()
		);
	}}>{submitText}</button
>
