<script lang="ts">
	import type { Agent } from '$lib/server/db/types';
	import { selectedAgent, type FavouriteAgentIDs } from './stores';

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
	const { starButtonOnClick, ariaLabel } = $derived.by(() => {
		if (isFavourite) {
			return {
				starButtonOnClick: unfavourite,
				ariaLabel: 'unfavourite'
			};
		} else {
			return {
				starButtonOnClick: favourite,
				ariaLabel: 'favourite'
			};
		}
	});

	const selectButtonClasses = $derived(
		$selectedAgent === agent.ID ? 'bg-secondary-contrast' : 'bg-plain-light'
	);
	const mainAgentClasses = $derived(
		isMain ? 'border-8 border-primary-dark border-double' : 'border-secondary-contrast border-4'
	);
</script>

<div class="aspect-square relative">
	<button
		class="w-full h-full rounded {selectButtonClasses} {mainAgentClasses}"
		onclick={selectAgent}
	>
		<img src="/api/image/agents/{agent.ID}/icon.webp" alt={agent.Name} />
	</button>

	{#if !isMain}
		<button
			class="absolute top-0 right-0 aspect-square w-1/3 flex"
			onclick={starButtonOnClick}
			aria-label={ariaLabel}
		>
			<i
				class="absolute fa-star fa-regular text-secondary-contrast text-xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
			>
			</i>
			{#if isFavourite}
				<i
					class="absolute fa-star fa-solid text-secondary text-xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				></i>
			{/if}
		</button>
	{/if}
</div>
