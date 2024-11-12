<script lang="ts">
	import colors, { type Color } from '$lib/colors';
	import type { Snippet } from 'svelte';

	type Direciton = 'left' | 'right' | 'up' | 'down';
	type Props = {
		color: Color;
		direction: Direciton;
		children: Snippet;
	};
	const { direction, children, color = 'plain-light' }: Props = $props();
</script>

<div class="tooltip {direction}">
	<i class="fa-regular fa-circle-question text-sm opacity-70"></i>
	<div class="tooltiptext text-sm text-plain-dark {direction}" style="--color: {colors[color]};">
		{@render children()}
	</div>
</div>

<style lang="scss">
	.tooltip {
		position: relative;
		display: inline-block;
		.tooltiptext {
			--arrow-width: 1rem;
			--margin: 0.5rem;
			transition: opacity 200ms ease-out;
			opacity: 0;
			pointer-events: none;
			width: 120px;
			background-color: var(--color);
			text-align: center;
			border-radius: 6px;
			padding: 5px 0;
			position: absolute;
			z-index: 10;

			&.left {
				right: calc(100% + var(--arrow-width) + var(--margin));
				top: 50%;
				transform: translateY(-50%);
				&::after {
					top: 50%;
					left: 100%;
					transform: translateY(-50%);
					border-color: transparent transparent transparent var(--color);
				}
			}

			&.right {
				left: calc(100% + var(--arrow-width) + var(--margin));
				top: 50%;
				transform: translateY(-50%);
				&::after {
					top: 50%;
					right: 100%;
					transform: translateY(-50%);
					border-color: transparent var(--color) transparent transparent;
				}
			}

			&.up {
				bottom: calc(100% + var(--arrow-width) + var(--margin));
				left: 50%;
				transform: translateX(-50%);
				&::after {
					top: 100%;
					left: 50%;
					transform: translateX(-50%);
					border-color: var(--color) transparent transparent transparent;
				}
			}

			&.down {
				top: calc(100% + var(--arrow-width) + var(--margin));
				left: 50%;
				transform: translateX(-50%);
				&::after {
					bottom: 100%;
					left: 50%;
					transform: translateX(-50%);
					border-color: transparent transparent var(--color) transparent;
				}
			}

			&::after {
				content: '';
				position: absolute;
				border-width: var(--arrow-width);
				border-style: solid;
			}
		}

		&:hover .tooltiptext {
			opacity: 1;
		}
	}
</style>
