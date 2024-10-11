<script lang="ts">
	import ElementFit from '$lib/ElementFit.svelte';
</script>

<ElementFit>
	<div class="grid grid-cols-3 grid-rows-3 aspect-video gap-6 -translate-x-[3.3333%] m-auto">
		<div class="col-span-2 row-span-2 relative">
			<canvas class="bg-black aspect-video w-[90%] h-[90%] bottom-0 right-0 absolute" />
			<h2 class="text-7xl font-bold text-primary absolute left-[9.5%] top-[-3%]">MAP AGENT</h2>
		</div>
		<div>
			<canvas class="bg-black aspect-video w-full h-full" />
		</div>
		<div>
			<canvas class="bg-black aspect-video w-full h-full" />
		</div>
		<div class="relative">
			<div
				class="grid grid-cols-1 grid-rows-3 w-[80%] absolute right-0 h-full
                uppercase text-3xl text-primary font-bold content-center tracking-widest"
			>
				<h2>normal throw</h2>
				<h2>grade: S</h2>
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
