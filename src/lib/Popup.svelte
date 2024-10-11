<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import './Popup.css';
	export let title: string;
	export let size_x: number = 80;
	export let size_y: number = 80;
	export let is_hidden = false;
</script>

{#if !is_hidden}
	<button
		class="fixed w-screen h-screen bg-slate-950 top-0 left-0 opacity-80 z-20 appear-animation-80"
		on:click={() => {
			is_hidden = true;
		}}
	/>
	<div
		class="fixed bg-slate-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl z-30 appear-animation"
		style="width: {size_x}vw; height: {size_y}vh;"
	>
		<div class="bg-slate-800 w-full h-[7%] rounded-xl text-primary p-1 flex">
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
		<div class="w-full h-[93%] p-2"><slot /></div>
	</div>
{/if}
