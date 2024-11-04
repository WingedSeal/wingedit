<script module>
	export const isPopupShow = writable(false);
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import { type Snippet } from 'svelte';
	interface Props {
		title: string;
		sizeX?: number;
		sizeY?: number;
		children?: Snippet;
	}
	let { title, sizeX = 80, sizeY = 80, children }: Props = $props();
</script>

{#if $isPopupShow}
	<button
		class="fixed w-screen h-screen bg-slate-950 top-0 left-0 opacity-80 z-20 appear-animation-80"
		onclick={() => {
			$isPopupShow = false;
		}}
		aria-label="close"
	></button>
	<div
		class="fixed bg-slate-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl z-30 appear-animation"
		style="width: {sizeX}vw; height: {sizeY}vh;"
	>
		<div class="bg-slate-800 w-full h-[7%] rounded-xl text-primary p-1 flex">
			<h1 class="my-auto ml-6 text-xl">{title}</h1>
			<button
				class="my-auto ml-auto mr-3 text-xl cursor-pointer"
				onclick={() => {
					$isPopupShow = false;
				}}
				aria-label="close"
			>
				<i class="fa-regular fa-circle-xmark"></i>
			</button>
		</div>
		<div class="w-full h-[93%] p-2">{@render children?.()}</div>
	</div>
{/if}

<style>
	@keyframes appear {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.appear-animation {
		animation: appear 200ms;
		animation-timing-function: ease-out;
		animation-iteration-count: 1;
	}

	@keyframes appear-80 {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.8;
		}
	}

	.appear-animation-80 {
		animation: appear-80 200ms;
		animation-timing-function: ease-out;
		animation-iteration-count: 1;
	}
</style>
