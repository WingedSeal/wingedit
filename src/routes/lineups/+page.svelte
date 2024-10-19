<script src="ts">
	import { goto } from '$app/navigation';

	export let data;
	let chosenMap = null;
	let chosenAgent = null;
	let canSubmit = false;
	let submitText = '';
	$: canSubmit = chosenMap && chosenAgent;
	$: if (canSubmit) {
		submitText = 'SELECT';
	} else if (!chosenAgent) {
		submitText = 'Please choose an agent';
	} else {
		submitText = 'Please choose a map';
	}
	let agentSearch = '';
	let mapSearch = '';
</script>

{#if data.user}
	You are signed in as {data.user.username}
{:else}
	You are not signed in
{/if}
<br />
agent = {chosenAgent}
<br />
map = {chosenMap}
<br />
AGENTS
<br />
<input type="text" placeholder="search" bind:value={agentSearch} />
<br />
{#each Object.values(data.agents) as agent}
	{#if agent.Name.toLowerCase().includes(agentSearch.toLowerCase())}
		<button
			class={chosenAgent === agent.Name ? `bg-blue-300` : `bg-slate-100`}
			on:click={() => (chosenAgent = agent.Name)}>{agent.Name}</button
		>{' '}
	{/if}
{/each}
<br />
MAPS
<br />
<input type="text" placeholder="search" bind:value={mapSearch} />
<br />
{#each Object.values(data.maps) as map}
	{#if map.Name.toLowerCase().includes(mapSearch.toLowerCase())}
		<button
			class={chosenMap === map.Name ? `bg-blue-300` : `bg-slate-100`}
			on:click={() => (chosenMap = map.Name)}>{map.Name}</button
		>{' '}
	{/if}
{/each}
<br />

<br /><br />
<button
	class="bg-amber-100"
	disabled={!canSubmit}
	on:click={() => {
		goto('/lineups/' + chosenAgent.toLowerCase() + '/' + chosenMap.toLowerCase());
	}}>{submitText}</button
>{' '}
