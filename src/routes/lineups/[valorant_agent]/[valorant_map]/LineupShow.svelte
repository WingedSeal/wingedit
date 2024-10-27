<script lang="ts">
	import ElementFit from '$lib/components/ElementFit.svelte';
	import type { GameInfo, Lineup } from '$lib/server/db/types';
	import LineupShowOverlay from '$lib/components/LineupShowOverlay.svelte';
	interface Props {
		lineup: Lineup;
		gameInfo: GameInfo;
	}

	let { lineup, gameInfo }: Props = $props();
</script>

<ElementFit>
	<div class="grid grid-cols-3 grid-rows-3 aspect-video gap-6 -translate-x-[3.3333%] m-auto">
		<div class="col-span-2 row-span-2 relative">
			<div class="bg-black aspect-video w-[90%] h-[90%] bottom-0 right-0 absolute">
				<LineupShowOverlay
					DrawOverMainX={lineup.DrawOverMainX}
					DrawOverMainY={lineup.DrawOverMainY}
					DrawOverSub1X={lineup.DrawOverSub1X}
					DrawOverSub1Y={lineup.DrawOverSub1Y}
					DrawOverSub2X={lineup.DrawOverSub2X}
					DrawOverSub2Y={lineup.DrawOverSub2Y}
				/>
				<img
					src={`/api/image/lineups/${lineup.ID}/throw-lineup.webp`}
					class="bg-black aspect-video w-full h-full"
					alt="throw-lineup.webp - How to line yourself up for the throw."
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
				src={`/api/image/lineups/${lineup.ID}/throw.webp`}
				class="bg-black aspect-video w-full h-full"
				alt="throw.webp - GIF of thowing the lineup."
			/>
		</div>
		<div>
			<img
				src={`/api/image/lineups/${lineup.ID}/land-spot.webp`}
				class="bg-black aspect-video w-full h-full"
				alt="land-spot.webp - Where the lineup lands."
			/>
		</div>
		<div class="relative">
			<div
				class="grid grid-cols-1 grid-rows-4 w-[80%] absolute right-0 h-full justify-center
                uppercase text-3xl text-primary font-bold content-center tracking-widest"
			>
				<h2>{gameInfo.throw_types[lineup.ThrowTypeID].Name}</h2>
				<h2>grade: {gameInfo.grades[lineup.GradeID].Name}</h2>
				<h2>difficulty: {gameInfo.grades[lineup.Difficulty].Name}</h2>
				<h2>time: {lineup.TimeToLand}s</h2>
			</div>
		</div>
		<div>
			<img
				src={`/api/image/lineups/${lineup.ID}/throw-spot-third-person.webp`}
				class="bg-black aspect-video w-full h-full"
				alt="throw-spot-third-person.webp - Third person view of the throw spot of the lineup."
			/>
		</div>
		<div>
			<img
				src={`/api/image/lineups/${lineup.ID}/throw-spot-first-person.webp`}
				class="bg-black aspect-video w-full h-full"
				alt="throw-spot-first-person.webp - First person view of the throw spot of the lineup."
			/>
		</div>
	</div>
</ElementFit>
