<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import type { Agent } from '$lib/server/db/types';
	import { selectedAgent, type FavouriteAgentID } from './stores';

	export let agent: Agent;
	export let favouriteAgentIDs: FavouriteAgentID;
	export let isFavourite: boolean = false;
	export let cantFavourite: boolean = false;
	const selectAgent = () => {
		$selectedAgent = agent.ID;
	};
	const favourite = () => {
		favouriteAgentIDs.add(agent.ID);
		isFavourite = true;
	};
	const unfavourite = () => {
		favouriteAgentIDs.delete(agent.ID);
		isFavourite = false;
	};
</script>

<div class="aspect-square relative">
	<button class="w-full h-full bg-red-300" on:click={selectAgent}>
		{agent.Name}
	</button>
	{#if !cantFavourite}
		{#if isFavourite}
			<button class="absolute top-0 right-0 aspect-square w-1/3 flex" on:click={unfavourite}>
				<i class="fa-solid fa-star text-yellow-400 fa-fw text-xl block m-auto" />
			</button>
		{:else}
			<button class="absolute top-0 right-0 aspect-square w-1/3 flex" on:click={favourite}>
				<i class="fa-regular fa-star text-yellow-400 fa-fw text-xl block m-auto" />
			</button>
		{/if}
	{/if}
</div>
