<script lang="ts">
	import ElementFit from '$lib/components/ElementFit.svelte';
	import { type LineupInfo } from './Lineup';
	export let lineup_info: LineupInfo;
	export let map: string;
	export let agent: string;
</script>

<ElementFit>
	<div class="grid grid-cols-3 grid-rows-3 aspect-video gap-6 -translate-x-[3.3333%] m-auto">
		<div class="col-span-2 row-span-2 relative">
			<canvas class="bg-black aspect-video w-[90%] h-[90%] bottom-0 right-0 absolute" />
			<h2
				class="text-7xl font-bold text-primary absolute right-[90.5%] bottom-[87%] translate-x-full w-full uppercase"
			>
				{map}
				{agent}
			</h2>
		</div>
		<div>
			<canvas class="bg-black aspect-video w-full h-full" />
		</div>
		<div>
			<canvas class="bg-black aspect-video w-full h-full" />
		</div>
		<div class="relative">
			<div
				class="grid grid-cols-1 grid-rows-3 w-[80%] absolute right-0 h-full justify-center
                uppercase text-3xl text-primary font-bold content-center tracking-widest"
			>
				<!-- <div class="flex"><h2 class="my-auto">normal throw</h2></div>
                <div class="flex"><h2 class="my-auto">grade: S</h2></div>
                <div class="flex"><h2 class="my-auto">description</h2></div> -->
				<h2>{lineup_info.throw_type}</h2>
				<h2>grade: {lineup_info.grade}</h2>
				<h2>description</h2>
			</div>
		</div>
		<div>
			<canvas class="bg-black aspect-video w-full h-full" />
		</div>
		<div>
			<canvas class="bg-black aspect-video w-full h-full" />
		</div>
	</div>
</ElementFit>
