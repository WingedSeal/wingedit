<script module lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { circIn } from 'svelte/easing';

	export const isLoaded = writable(false);
</script>

<script lang="ts">
</script>

<noscript>
	<style>
		.noscript-hide {
			display: none;
		}
	</style>
</noscript>

{#if !$isLoaded}
	<div
		transition:fade={{ delay: 0, duration: 300, easing: circIn }}
		class="relative z-50 noscript-hide"
	>
		<div class="w-screen h-screen fixed bg-slate-900 flex loading-screen">
			<div id="wrapper" class="scale-[1.2] md:scale-[2.1] m-auto absolute">
				<div class="profile-main-loader">
					<div class="loader">
						<svg class="circular-loader" viewBox="25 25 50 50">
							<circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke-width="4" />
						</svg>
					</div>
				</div>
			</div>
			<img
				class="aspect-square max-w-[25dvh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-75 rounded-full"
				src=""
				alt="WingedIT icon"
			/>
		</div>
	</div>
{/if}

<style lang="scss">
	#wrapper {
		position: relative;
		height: 100%;
	}

	.profile-main-loader {
		left: 50% !important;
		margin-left: -100px;
		position: fixed !important;
		top: 50% !important;
		margin-top: -100px;
		width: 45px;
		.loader {
			position: relative;
			margin: 0px auto;
			width: 200px;
			height: 200px;
			&:before {
				content: '';
				display: block;
				padding-top: 100%;
			}
		}
	}

	.circular-loader {
		animation: rotate 2s linear infinite;
		height: 100%;
		transform-origin: center center;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		margin: auto;
	}

	.loader-path {
		stroke-dasharray: 150, 200;
		stroke-dashoffset: -10;
		animation:
			dash 1.5s ease-in-out infinite,
			color 1s ease-in-out infinite;
		stroke-linecap: round;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes dash {
		0% {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -124;
		}
	}
	@keyframes color {
		14% {
			stroke: #70369d;
		}
		29% {
			stroke: #4b369d;
		}
		35% {
			stroke: #487de7;
		}
		57% {
			stroke: #79c314;
		}
		71% {
			stroke: #faeb36;
		}
		86% {
			stroke: #ffa500;
		}
		100% {
			stroke: #e81416;
		}
	}
</style>
