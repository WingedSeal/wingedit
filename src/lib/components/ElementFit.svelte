<script lang="ts">
	interface Props {
		widthRatio?: number;
		heightRatio?: number;
		children?: import('svelte').Snippet;
	}

	let { widthRatio = 16, heightRatio = 9, children }: Props = $props();

	let clientWidth = $state<number>(0);
	let clientHeight = $state<number>(0);

	let contentWidth = $derived<number>(
		Math.min(clientWidth, clientHeight * (widthRatio / heightRatio))
	);
	let contentHeight = $derived<number>(
		Math.min(clientHeight, clientWidth * (heightRatio / widthRatio))
	);
</script>

<div class="flex justify-center items-center w-full h-full" bind:clientWidth bind:clientHeight>
	<div style="width: {contentWidth}px; height: {contentHeight}px">
		{@render children?.()}
	</div>
</div>
