<script lang="ts">
	export let widthRatio = 16;
	export let heightRatio = 9;

	let clientWidth: number;
	let clientHeight: number;

	let contentWidth: number;
	let contentHeight: number;

	$: contentWidth = Math.min(clientWidth, clientHeight * (widthRatio / heightRatio));
	$: contentHeight = Math.min(clientHeight, clientWidth * (heightRatio / widthRatio));
</script>

<div class="container" bind:clientWidth bind:clientHeight>
	<div style="width: {contentWidth}px; height: {contentHeight}px">
		<slot />
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
</style>
