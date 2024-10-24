<script lang="ts">
	import { browser } from '$app/environment';
	import {
		clientFavouriteAgents,
		clientMainAgent,
		serverFavouriteAgents,
		serverMainAgent,
		type FavouriteAgentID
	} from './stores';
	import SelectAgent from './SelectAgent.svelte';
	import { selectedAgent } from './stores';

	export let data;

	let favouriteAgentIDs: FavouriteAgentID = serverFavouriteAgents();
	let mainAgentID = serverMainAgent();
	$: if (browser) {
		favouriteAgentIDs = clientFavouriteAgents();
		mainAgentID = clientMainAgent();
	}
</script>

<div class="max-w-[30%] overflow-y-auto h-[100dvh] bg-purple-500 p-8 flex flex-col">
	<SelectAgent mainAgentID={$mainAgentID} {favouriteAgentIDs} agents={data.agents} />
</div>
