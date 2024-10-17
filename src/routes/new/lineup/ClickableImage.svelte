<script lang="ts">
	export let onClick = (xPercent: number, yPercent: number) => {};
	export let src: string;
	export let alt: string;
	const click = (event: MouseEvent) => {
		if (event.buttons != 1) {
			return;
		}
		const rect = (event.currentTarget! as HTMLElement).getBoundingClientRect();
		const xPercent = ((event.clientX - rect.x) * 100) / rect.width;
		const yPercent = 100 - ((event.clientY - rect.y) * 100) / rect.height;
		onClick(xPercent, yPercent);
	};
</script>

<button class="bg-black aspect-video" on:mousemove={click}>
	<img {src} {alt} class="w-full h-full" on:dragstart|preventDefault />
</button>
