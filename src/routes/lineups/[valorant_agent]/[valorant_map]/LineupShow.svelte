<script lang="ts">
	import ElementFit from '$lib/components/ElementFit.svelte';
	import type { GameInfo, Lineup } from '$lib/server/db/types';
	export let lineup: Lineup;
	export let gameInfo: GameInfo;
	const mainSizePercent = 10;
	const subSizePercent = 7;
	let clientHeight: number;
	let clientWidth: number;
	let main1: [number, number];
	let main2: [number, number];
	let sub1: [number, number];
	let sub2: [number, number];
	let hasSub =
		lineup.DrawOverSub1X && lineup.DrawOverSub1Y && lineup.DrawOverSub2X && lineup.DrawOverSub2Y;
	$: if (hasSub) {
		const main = [
			(lineup.DrawOverMainX! * clientWidth!) / 100,
			((100 - lineup.DrawOverMainY!) * clientHeight!) / 100
		];
		sub1 = [
			(lineup.DrawOverSub1X! * clientWidth!) / 100,
			((100 - lineup.DrawOverSub1Y!) * clientHeight!) / 100
		];
		sub2 = [
			(lineup.DrawOverSub2X! * clientWidth!) / 100,
			((100 - lineup.DrawOverSub2Y!) * clientHeight!) / 100
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
		main1 = [main[0] + (dx1 * mainRadius) / length1, main[1] + (dy1 * mainRadius) / length1];
		main2 = [main[0] + (dx2 * mainRadius) / length2, main[1] + (dy2 * mainRadius) / length2];
	}
</script>

<ElementFit>
	<div class="grid grid-cols-3 grid-rows-3 aspect-video gap-6 -translate-x-[3.3333%] m-auto">
		<div class="col-span-2 row-span-2 relative">
			<div
				class="bg-black aspect-video w-[90%] h-[90%] bottom-0 right-0 absolute"
				bind:clientHeight
				bind:clientWidth
			>
				<div
					class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-600"
					style={`height: ${mainSizePercent}%; left: ${lineup.DrawOverMainX}%; bottom: ${lineup.DrawOverMainY}%; border-width: ${clientHeight * 0.01}px;`}
				/>
				{#if hasSub}
					<div
						class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-300"
						style={`height: ${subSizePercent}%; left: ${lineup.DrawOverSub1X}%; bottom: ${lineup.DrawOverSub1Y}%; border-width: ${clientHeight * 0.01}px;`}
					/>
					<div
						class="aspect-square absolute bg-transparent -translate-x-1/2 translate-y-1/2
					rounded-[50%] border-solid border-red-300"
						style={`height: ${subSizePercent}%; left: ${lineup.DrawOverSub2X}%; bottom: ${lineup.DrawOverSub2Y}%; border-width: ${clientHeight * 0.01}px;`}
					/>
					<svg class="h-full w-full absolute stroke-red-300 stroke-[0.5%]">
						<polyline points={`${sub1} ${main1}`}></polyline>
					</svg>
					<svg class="h-full w-full absolute stroke-red-300 stroke-[0.5%]">
						<polyline points={`${sub2} ${main2}`}></polyline>
					</svg>
				{/if}
				<img
					src="/api/image/test.jpg"
					class="bg-black aspect-video w-full h-full"
					alt="throw-lineup.jpg - How to line yourself up for the throw."
				/>
			</div>
			<h2
				class="text-7xl font-bold text-primary absolute right-[90.5%] bottom-[87%] translate-x-full w-full uppercase"
			>
				{gameInfo.maps[lineup.MapID].Name}
				{gameInfo.agents[lineup.AgentID].Name}
			</h2>
		</div>
		<div>
			<img
				src="/api/image/test.jpg"
				class="bg-black aspect-video w-full h-full"
				alt="throw.gif - GIF of thowing the lineup."
			/>
		</div>
		<div>
			<img
				src="/api/image/test.jpg"
				class="bg-black aspect-video w-full h-full"
				alt="landspot.jpg - Where the lineup lands."
			/>
		</div>
		<div class="relative">
			<div
				class="grid grid-cols-1 grid-rows-3 w-[80%] absolute right-0 h-full justify-center
                uppercase text-3xl text-primary font-bold content-center tracking-widest"
			>
				<!-- <div class="flex"><h2 class="my-auto">normal throw</h2></div>
                <div class="flex"><h2 class="my-auto">grade: S</h2></div>
                <div class="flex"><h2 class="my-auto">description</h2></div> -->
				<h2>{gameInfo.throw_types[lineup.ThrowTypeID].Name}</h2>
				<h2>grade: {gameInfo.grades[lineup.GradeID].Name}</h2>
				<h2>time: {lineup.TimeToLand}s</h2>
			</div>
		</div>
		<div>
			<img
				src="/api/image/test.jpg"
				class="bg-black aspect-video w-full h-full"
				alt="throw-spot-third-person.jpg - Third person view of the throw spot of the lineup."
			/>
		</div>
		<div>
			<img
				src="/api/image/test.jpg"
				class="bg-black aspect-video w-full h-full"
				alt="throw-spot-first-person.jpg - First person view of the throw spot of the lineup."
			/>
		</div>
	</div>
</ElementFit>
