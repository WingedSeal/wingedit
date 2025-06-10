<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		class?: string;
		style?: string;
	}

	let { src, alt, class: className = '', style = '', ...restProps }: Props = $props();

	const MAX_ZOOM = 5;
	const ZOOM_RATE = 0.002;
	let zoom = $state(2);
	const SIZE = 192;
	const OFFSET_X = 100;
	const OFFSET_Y = -100;

	let showMagnifier = $state(false);
	let magnifierX = $state(0);
	let magnifierY = $state(0);
	let currentImage = $state<HTMLImageElement | null>(null);

	const handleMouseEnter = (event: MouseEvent) => {
		showMagnifier = true;
		currentImage = event.target as HTMLImageElement;
	};

	const handleMouseLeave = () => {
		showMagnifier = false;
		currentImage = null;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!showMagnifier || !currentImage) return;
		const rect = currentImage.getBoundingClientRect();
		magnifierX = event.clientX - rect.left;
		magnifierY = event.clientY - rect.top;
	};
	const handleWheel = (event: WheelEvent) => {
		event.preventDefault();
		zoom = Math.min(MAX_ZOOM, Math.max(1, zoom - event.deltaY * ZOOM_RATE));
	};
</script>

<img
	{src}
	{alt}
	class={`magnifiable-image ${className}`}
	{style}
	{...restProps}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onmousemove={handleMouseMove}
	onwheel={handleWheel}
/>

{#if showMagnifier && currentImage}
	<div
		class="absolute rounded-[50%] z-50 border-white border-8 bg-no-repeat -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black"
		id="wtf"
		style="
            width: {SIZE}px;
            height: {SIZE}px;
			background-image: url('{src}');
            left: {magnifierX + OFFSET_X}px;
            top: {magnifierY + OFFSET_Y}px;
			background-size: {currentImage.width * zoom}px {currentImage.height * zoom}px;
			background-position: {-magnifierX * zoom + SIZE / 2}px {-magnifierY * zoom + SIZE / 2}px;
		"
	></div>
{/if}

<style lang="scss">
	.magnifiable-image {
		cursor:
			url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="21 21l-4.35-4.35"/></svg>')
				16 16,
			auto;
	}
</style>
