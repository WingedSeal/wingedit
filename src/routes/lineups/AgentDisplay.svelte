<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import type { Agent } from '$lib/server/db/types';
	import { selectedAgent, type FavouriteAgentIDs } from './stores';
	import Page from '../+page.svelte';

	interface Props {
		agent: Agent;
		favouriteAgentIDs: FavouriteAgentIDs;
		isFavourite?: boolean;
		isMain?: boolean;
	}

	let {
		agent,
		favouriteAgentIDs,
		isFavourite = $bindable(false),
		isMain = false
	}: Props = $props();
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
	const { starButtonOnClick, startButtonClasses, ariaLabel } = $derived.by(() => {
		if (isFavourite) {
			return {
				starButtonOnClick: unfavourite,
				startButtonClasses: 'fa-solid',
				ariaLabel: 'unfavourite'
			};
		} else {
			return {
				starButtonOnClick: favourite,
				startButtonClasses: 'fa-regular',
				ariaLabel: 'favourite'
			};
		}
	});

	const selectButtonClasses = $derived($selectedAgent === agent.ID ? 'bg-red-700' : 'bg-red-300');
	const mainAgentClasses = $derived(isMain ? 'border-8 border-orange-400 ' : '');
</script>

<div class="aspect-square relative">
	<button class="w-full h-full {selectButtonClasses} {mainAgentClasses}" onclick={selectAgent}>
		{agent.Name}
	</button>

	{#if !isMain}
		<button
			class="absolute top-0 right-0 aspect-square w-1/3 flex"
			onclick={starButtonOnClick}
			aria-label={ariaLabel}
		>
			<i class="{startButtonClasses} fa-star text-yellow-400 fa-fw text-xl block m-auto"></i>
		</button>
	{/if}
</div>
