<script lang="ts">
	import type { Lineup } from '$lib/server/db/types';

	type Props = {
		lineup: Lineup;
	};

	const { lineup }: Props = $props();
	// const { from, to } = $derived.by(() => {
	// 	const main = [
	// 		(DrawOverMainX * clientWidth!) / 100,
	// 		((100 - DrawOverMainY) * clientHeight!) / 100
	// 	];
	// 	let sub1 = [
	// 		(DrawOverSub1X! * clientWidth!) / 100,
	// 		((100 - DrawOverSub1Y!) * clientHeight!) / 100
	// 	];
	// 	let sub2 = [
	// 		(DrawOverSub2X! * clientWidth!) / 100,
	// 		((100 - DrawOverSub2Y!) * clientHeight!) / 100
	// 	];
	// 	const dx1 = sub1[0] - main[0];
	// 	const dy1 = sub1[1] - main[1];
	// 	const dx2 = sub2[0] - main[0];
	// 	const dy2 = sub2[1] - main[1];
	// 	const length1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
	// 	const length2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
	// 	const mainRadius = (mainSizePercent * clientHeight!) / 200;
	// 	const subRadius = (subSizePercent * clientHeight!) / 200;
	// 	sub1[0] -= (dx1 * subRadius) / length1;
	// 	sub1[1] -= (dy1 * subRadius) / length1;
	// 	sub2[0] -= (dx2 * subRadius) / length2;
	// 	sub2[1] -= (dy2 * subRadius) / length2;
	// 	const main1 = [main[0] + (dx1 * mainRadius) / length1, main[1] + (dy1 * mainRadius) / length1];
	// 	const main2 = [main[0] + (dx2 * mainRadius) / length2, main[1] + (dy2 * mainRadius) / length2];
	// 	return { main1, main2, sub1, sub2 };
	// });
</script>

<div class="h-full w-full">
	<div
		class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-600 h-10 border-2"
		style={`left: ${lineup.FromX}%; bottom: ${lineup.FromY}%;`}
	></div>
	<div
		class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-600 h-10 border-2"
		style={`left: ${lineup.ToX}%; bottom: ${lineup.ToY}%;`}
	></div>
</div>
