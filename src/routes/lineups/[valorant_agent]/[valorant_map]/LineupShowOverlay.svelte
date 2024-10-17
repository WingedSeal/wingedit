<script lang="ts">
	export let DrawOverMainX: number;
	export let DrawOverMainY: number;
	export let DrawOverSub1X: number | null;
	export let DrawOverSub1Y: number | null;
	export let DrawOverSub2X: number | null;
	export let DrawOverSub2Y: number | null;
	const mainSizePercent = 10;
	const subSizePercent = 7;
	let clientHeight: number;
	let clientWidth: number;
	let main1: [number, number];
	let main2: [number, number];
	let sub1: [number, number];
	let sub2: [number, number];
	let hasSub: boolean;
	$: if ((DrawOverSub1X as unknown as string) === '') DrawOverSub1X = null;
	$: if ((DrawOverSub1Y as unknown as string) === '') DrawOverSub1Y = null;
	$: if ((DrawOverSub2X as unknown as string) === '') DrawOverSub2X = null;
	$: if ((DrawOverSub2Y as unknown as string) === '') DrawOverSub2Y = null;
	$: hasSub =
		DrawOverSub1X != null &&
		DrawOverSub1Y != null &&
		DrawOverSub2X != null &&
		DrawOverSub2Y != null;
	$: if (hasSub) {
		const main = [
			(DrawOverMainX * clientWidth!) / 100,
			((100 - DrawOverMainY) * clientHeight!) / 100
		];
		sub1 = [(DrawOverSub1X! * clientWidth!) / 100, ((100 - DrawOverSub1Y!) * clientHeight!) / 100];
		sub2 = [(DrawOverSub2X! * clientWidth!) / 100, ((100 - DrawOverSub2Y!) * clientHeight!) / 100];
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
		main1 = [main[0] + (dx1 * mainRadius) / length1, main[1] + (dy1 * mainRadius) / length1];
		main2 = [main[0] + (dx2 * mainRadius) / length2, main[1] + (dy2 * mainRadius) / length2];
	}
</script>

<div bind:clientWidth bind:clientHeight class="w-full h-full absolute pointer-events-none">
	<div
		class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-600"
		style={`height: ${mainSizePercent}%; left: ${DrawOverMainX}%; bottom: ${DrawOverMainY}%; border-width: ${clientHeight * 0.01}px;`}
	/>
	{#if hasSub && !isNaN(sub1[0])}
		<div
			class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-300"
			style={`height: ${subSizePercent}%; left: ${DrawOverSub1X}%; bottom: ${DrawOverSub1Y}%; border-width: ${clientHeight * 0.01}px;`}
		/>
		<div
			class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-300"
			style={`height: ${subSizePercent}%; left: ${DrawOverSub2X}%; bottom: ${DrawOverSub2Y}%; border-width: ${clientHeight * 0.01}px;`}
		/>
		<svg class="h-full w-full absolute stroke-red-300 stroke-[0.5%]">
			<polyline points={`${sub1} ${main1}`}></polyline>
		</svg>
		<svg class="h-full w-full absolute stroke-red-300 stroke-[0.5%]">
			<polyline points={`${sub2} ${main2}`}></polyline>
		</svg>
	{/if}
</div>
