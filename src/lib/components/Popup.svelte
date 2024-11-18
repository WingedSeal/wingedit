<script module>
	export const isPopupShow = writable(false);
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, type Snippet } from 'svelte';
	import { browser } from '$app/environment';
	interface Props {
		title: string;
		sizeX?: number;
		sizeY?: number;
		titleRight?: Snippet;
		children?: Snippet;
	}
	let { title, sizeX = 80, sizeY = 80, children, titleRight }: Props = $props();
</script>

{#if $isPopupShow && browser}
	<button
		class="fixed w-screen h-screen bg-slate-950 top-0 left-0 opacity-80 z-[39] appear-animation-80"
		onclick={() => {
			$isPopupShow = false;
		}}
		aria-label="close popup"
	></button>
	<div
		class="fixed bg-slate-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl z-40 appear-animation flex flex-col"
		style="width: {sizeX}vw; height: {sizeY}vh;"
	>
		<div class="bg-slate-800 w-full h-[7%] rounded-xl text-primary p-1 flex">
			<h1 class="my-auto ml-6 text-xl text-nowrap">{title}</h1>
			<div class="w-full h-full flex">
				{@render titleRight?.()}
			</div>
			<button
				class="my-auto mr-3 text-xl cursor-pointer"
				onclick={() => {
					$isPopupShow = false;
				}}
				aria-label="close"
			>
				<i class="fa-regular fa-circle-xmark"></i>
			</button>
		</div>
		<div class="w-full h-full p-2 overflow-y-auto">{@render children?.()}</div>
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
