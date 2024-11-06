<script lang="ts">
	import { squareToCircle } from '$lib/components/calculateLinePos';

	type Props = {
		fromCenter: [number, number];
		toCenter: [number, number];
		lineColor: string;
	};
	let clientHeight = $state(0);
	let clientWidth = $state(0);
	const fromRadius = 2;
	const toRadius = 2;
	const lineWidth = 0.4;

	let { fromCenter, toCenter, lineColor }: Props = $props();

	const { from, to } = $derived.by(() => {
		return squareToCircle(fromCenter, toCenter, [clientWidth, clientHeight], fromRadius, toRadius);
	});
</script>

<div
	class="h-full w-full pointer-events-none bg-[rgba(173,116,116,0.3)]"
	bind:clientWidth
	bind:clientHeight
>
	<div
		class="aspect-square absolute -translate-x-1/2 translate-y-1/2
					rounded-md border-solid border-red-700"
		style="height: {fromRadius *
			2}%; left: {fromCenter[0]}%; bottom: {fromCenter[1]}%; border-width: {(clientHeight *
			lineWidth) /
			100}px;"
	></div>
	<div
		class="aspect-square absolute -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-700 border-[1rem]"
		style="height: {toRadius *
			2}%; left: {toCenter[0]}%; bottom: {toCenter[1]}%; border-width: {(clientHeight * lineWidth) /
			100}px;"
	></div>

	{#if !isNaN(from[0]) && !isNaN(from[1]) && !isNaN(to[0]) && !isNaN(to[0])}
		<svg
			class="h-full w-full absolute focus:outline-none"
			style="stroke: {lineColor}; stroke-width: {(clientHeight * lineWidth) / 100};"
		>
			<polyline points={`${from} ${to}`}></polyline>
		</svg>
	{/if}
</div>
