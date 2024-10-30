<script lang="ts">
	import type { Lineup } from '$lib/server/db/types';
	import ClickableImage from '../../../new/lineup/ClickableImage.svelte';

	type Props = {
		lineup: Lineup;
	};
	let clientHeight = $state(0);
	let clientWidth = $state(0);
	const agentRadius = 2.5;
	const agentBorder = 1;
	const lineWidth = 0.4;

	const { lineup }: Props = $props();
	const { from, to } = $derived.by(() => {
		let from = [(lineup.FromX * clientWidth) / 100, ((100 - lineup.FromY) * clientHeight) / 100];
		let to = [(lineup.ToX * clientWidth) / 100, ((100 - lineup.ToY) * clientHeight) / 100];
		const dx = from[0] - to[0];
		const dy = from[1] - to[1];
		const length = Math.sqrt(dx * dx + dy * dy);
		const radiusFrom = (agentRadius * clientHeight) / 100;
		const radiusTo = (2.5 * clientHeight) / 100;
		const abs_dx = Math.abs(dx);
		const abs_dy = Math.abs(dy);
		from[0] -= Math.sign(dx) * (abs_dy > abs_dx ? (radiusFrom * abs_dx) / abs_dy : radiusFrom);
		from[1] -= Math.sign(dy) * (abs_dx > abs_dy ? (radiusFrom * abs_dy) / abs_dx : radiusFrom);

		to[0] += (dx * radiusTo) / length;
		to[1] += (dy * radiusTo) / length;
		return { from, to };
	});
	const gradeColors: { [gradeID: number]: string } = {
		// todo: move to db
		1: 'yellow',
		2: 'purple',
		3: 'blue',
		4: 'green',
		5: 'white'
	};
</script>

<div class="h-full w-full pointer-events-none relative" bind:clientWidth bind:clientHeight>
	<img
		class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-md border-solid"
		style="height: {agentRadius *
			2}%; left: {lineup.FromX}%; bottom: {lineup.FromY}%; border-width: {(clientHeight *
			lineWidth) /
			100}px"
		src="/api/image/agents/{lineup.AgentID}/icon.webp"
		alt="Agent {lineup.AgentID}"
	/>
	<div
		class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-600 h-[5%] border-[1rem]"
		style={`left: ${lineup.ToX}%; bottom: ${lineup.ToY}%;`}
	></div>
	<svg
		class="h-full w-full absolute"
		style="stroke: {gradeColors[lineup.GradeID]}; stroke-width: {(clientHeight * lineWidth) / 100}"
	>
		<polyline points={`${from} ${to}`}></polyline>
	</svg>
</div>
