<script lang="ts">
	import type { Lineup } from '$lib/server/db/types';
	import type { Snippet } from 'svelte';
	import { isFullScreenImage, selectedFullScreenImage } from './stores';

	type Props = {
		lineup: Lineup;
		overlay: Snippet;
	};
	let { lineup, overlay }: Props = $props();
	const images = [
		`/api/image/lineups/${lineup.ID}/throw-lineup.webp`,
		`/api/image/lineups/${lineup.ID}/throw.webp`,
		`/api/image/lineups/${lineup.ID}/land-spot.webp`,
		`/api/image/lineups/${lineup.ID}/throw-spot-third-person.webp`,
		`/api/image/lineups/${lineup.ID}/throw-spot-first-person.webp`
	];
	const alts = [
		'throw-lineup.webp - How to line yourself up for the throw.',
		'throw.webp - GIF of thowing the lineup.',
		'land-spot.webp - Where the lineup lands.',
		'throw-spot-third-person.webp - Third person view of the throw spot of the lineup.',
		'throw-spot-first-person.webp - First person view of the throw spot of the lineup.'
	];
	const mod = (n: number, m: number) => {
		return ((n % m) + m) % m;
	};
</script>

<button
	class="fixed w-screen h-screen bg-slate-950 top-0 left-0 opacity-80 z-[49] appear-animation-80"
	onclick={() => {
		$isFullScreenImage = false;
	}}
	aria-label="close gallery"
></button>
<div
	class="fixed w-screen h-screen z-50 left-0 top-0 pointer-events-none flex items-center justify-center"
>
	<div class="aspect-video relative m-auto">
		{#if $selectedFullScreenImage == 0}
			{@render overlay()}
		{/if}
		<img
			src={images[$selectedFullScreenImage]}
			alt={alts[$selectedFullScreenImage]}
			class="w-full h-full object-contain"
		/>
	</div>
</div>

<svelte:window
	on:keydown={(event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowLeft':
				selectedFullScreenImage.update((n) => mod(n - 1, 5));
				break;
			case 'ArrowRight':
				selectedFullScreenImage.update((n) => mod(n + 1, 5));
				break;
		}
	}}
/>
