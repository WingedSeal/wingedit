<script lang="ts">
	interface Props {
		DrawOverMainX: number;
		DrawOverMainY: number;
		DrawOverSub1X: number | null;
		DrawOverSub1Y: number | null;
		DrawOverSub2X: number | null;
		DrawOverSub2Y: number | null;
	}

	const {
		DrawOverMainX,
		DrawOverMainY,
		DrawOverSub1X,
		DrawOverSub1Y,
		DrawOverSub2X,
		DrawOverSub2Y
	}: Props = $props();
	const SIZE_MULTIPLIER = 1;
	const mainSizePercent = 5 * SIZE_MULTIPLIER;
	const subSizePercent = 2 * SIZE_MULTIPLIER;
	let clientHeight = $state<number>();
	let clientWidth = $state<number>();
	const { main1, main2, sub1, sub2 } = $derived.by(() => {
		if (
			DrawOverSub1X === null ||
			DrawOverSub1Y === null ||
			DrawOverSub2X === null ||
			DrawOverSub2Y === null
		)
			return { main1: undefined, main2: undefined, sub1: undefined, sub2: undefined };

		const main = [
			(DrawOverMainX * clientWidth!) / 100,
			((100 - DrawOverMainY) * clientHeight!) / 100
		];
		let sub1 = [
			(DrawOverSub1X! * clientWidth!) / 100,
			((100 - DrawOverSub1Y!) * clientHeight!) / 100
		];
		let sub2 = [
			(DrawOverSub2X! * clientWidth!) / 100,
			((100 - DrawOverSub2Y!) * clientHeight!) / 100
		];
		const dx1 = sub1[0] - main[0];
		const dy1 = sub1[1] - main[1];
		const dx2 = sub2[0] - main[0];
		const dy2 = sub2[1] - main[1];
		const length1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
		const length2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
		const mainRadius = (mainSizePercent * clientHeight!) / 200;
		const subRadius = (subSizePercent * clientHeight!) / 200;
		sub1[0] -= (dx1 * subRadius) / length1;
		sub1[1] -= (dy1 * subRadius) / length1;
		sub2[0] -= (dx2 * subRadius) / length2;
		sub2[1] -= (dy2 * subRadius) / length2;
		const main1 = [main[0] + (dx1 * mainRadius) / length1, main[1] + (dy1 * mainRadius) / length1];
		const main2 = [main[0] + (dx2 * mainRadius) / length2, main[1] + (dy2 * mainRadius) / length2];
		return { main1, main2, sub1, sub2 };
	});
</script>

<div bind:clientWidth bind:clientHeight class="w-full h-full absolute pointer-events-none">
	<div
		class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-600"
		style="height: {mainSizePercent}%; left: {DrawOverMainX}%; bottom: {DrawOverMainY}%; border-width: {clientHeight *
			0.005 *
			SIZE_MULTIPLIER}px;"
	></div>
	{#if sub1 && sub2}
		<div
			class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-300"
			style={`height: ${subSizePercent}%; left: ${DrawOverSub1X}%; bottom: ${DrawOverSub1Y}%; border-width: ${clientHeight * 0.003 * SIZE_MULTIPLIER}px;`}
		></div>
		<div
			class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-300"
			style={`height: ${subSizePercent}%; left: ${DrawOverSub2X}%; bottom: ${DrawOverSub2Y}%; border-width: ${clientHeight * 0.003 * SIZE_MULTIPLIER}px;`}
		></div>
		<svg
			class="h-full w-full absolute stroke-red-300"
			style={`stroke-width: ${0.15 * SIZE_MULTIPLIER}%;`}
		>
			<polyline points={`${sub1} ${main1}`}></polyline>
		</svg>
		<svg
			class="h-full w-full absolute stroke-red-300"
			style={`stroke-width: ${0.15 * SIZE_MULTIPLIER}%;`}
		>
			<polyline points={`${sub2} ${main2}`}></polyline>
		</svg>
	{/if}
</div>
