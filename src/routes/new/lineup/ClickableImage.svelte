<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onClick: (xPercent: number, yPercent: number) => void;
		buttonClass: string;
		children: Snippet;
	}

	let { onClick, buttonClass, children }: Props = $props();
	const round = (num: number) => {
		return Math.round((num + Number.EPSILON) * 100) / 100;
	};
	const handleEvent = (event: MouseEvent) => {
		const rect = (event.currentTarget! as HTMLElement).getBoundingClientRect();
		const xPercent = ((event.clientX - rect.x) * 100) / rect.width;
		const yPercent = 100 - ((event.clientY - rect.y) * 100) / rect.height;
		onClick(round(xPercent), round(yPercent));
	};
	const move = (event: MouseEvent) => {
		if (event.buttons != 1) {
			return;
		}
		handleEvent(event);
	};
</script>

<button class={buttonClass} onmousemove={move} onmousedown={handleEvent}>
	{@render children?.()}
</button>
