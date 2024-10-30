<script lang="ts">
	import type { Lineup } from '$lib/server/db/types';

	type Props = {
		lineup: Lineup;
	};
	let clientHeight = $state(0);
	let clientWidth = $state(0);

	const { lineup }: Props = $props();
	const { from, to } = $derived.by(() => {
		let from = [(lineup.FromX * clientWidth) / 100, ((100 - lineup.FromY) * clientHeight) / 100];
		let to = [(lineup.ToX * clientWidth) / 100, ((100 - lineup.ToY) * clientHeight) / 100];
		const dx = from[0] - to[0];
		const dy = from[1] - to[1];
		const length = Math.sqrt(dx * dx + dy * dy);
		const radiusFrom = (2.5 * clientHeight) / 100;
		const radiusTo = (2.5 * clientHeight) / 100;
		from[0] -= (dx * radiusFrom) / length;
		from[1] -= (dy * radiusFrom) / length;
		to[0] += (dx * radiusTo) / length;
		to[1] += (dy * radiusTo) / length;
		return { from, to };
	});
</script>

<div class="h-full w-full pointer-events-none relative" bind:clientWidth bind:clientHeight>
	<div
		class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-600 h-[5%] border-[1rem]"
		style={`left: ${lineup.FromX}%; bottom: ${lineup.FromY}%;`}
	></div>
	<div
		class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-600 h-[5%] border-[1rem]"
		style={`left: ${lineup.ToX}%; bottom: ${lineup.ToY}%;`}
	></div>
	<svg class="h-full w-full absolute stroke-red-300 stroke-[1rem]">
		<polyline points={`${from} ${to}`}></polyline>
	</svg>
</div>
