<script lang="ts">
	interface Props {
		onClick: (xPercent: number, yPercent: number) => void;
		src: string;
		alt: string;
	}

	let { onClick, src, alt }: Props = $props();
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

<button class="aspect-video w-full h-full" onmousemove={move} onmousedown={handleEvent}>
	<img {src} {alt} class="w-full h-full" draggable="false" />
</button>
