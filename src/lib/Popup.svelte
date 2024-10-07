<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	export let title: string;
	export let size_x: number = 50;
	export let size_y: number = 50;
	export let is_hidden = false;
</script>

{#if !is_hidden}
	<div class="fixed w-screen h-screen bg-slate-950 top-0 left-0 opacity-80 z-20"></div>
	<div
		class="fixed bg-slate-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl w-[{size_x}vw] h-[{size_y}vh] z-30"
	>
		<div class="bg-slate-800 w-full h-[10%] rounded-xl text-primary p-1 flex">
			<h1 class="my-auto ml-6 text-xl">{title}</h1>
			<button
				class="my-auto ml-auto mr-3 text-xl cursor-pointer"
				on:click={() => {
					is_hidden = true;
				}}
			>
				<i class="fa-regular fa-circle-xmark" />
			</button>
		</div>
		<div class="w-full h-full p-2"><slot /></div>
	</div>
{/if}
