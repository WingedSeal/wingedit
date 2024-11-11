<script lang="ts">
	import colors from '$lib/colors';

	let foreground = $state<keyof typeof colors>(Object.keys(colors)[0] as keyof typeof colors);
	let background = $state<keyof typeof colors>(Object.keys(colors)[0] as keyof typeof colors);
</script>

<main class="p-16 flex flex-col gap-4">
	<div class="flex gap-2 flex-wrap">
		{#each Object.entries(colors) as [color, hex]}
			<div class="flex flex-col p-2 border-black border-2">
				<h1 class="font-bold text-lg">{color}</h1>
				<div class="w-16 h-16 bg-{color}"></div>
				<h2>{hex}</h2>
			</div>
		{/each}
	</div>
	<div class="flex gap-4">
		<div class="flex flex-col gap-1">
			<label for="foreground" class="font-bold">Foreground</label>
			<select name="foreground" bind:value={foreground}>
				{#each Object.keys(colors) as color}
					<option value={color}>{color}</option>
				{/each}
			</select>
			<label for="background" class="font-bold">Background</label>
			<select name="background" bind:value={background}>
				{#each Object.keys(colors) as color}
					<option value={color}>{color}</option>
				{/each}
			</select>
		</div>
		<div class="min-w-24 bg-{background} text-{foreground} p-8">
			<span>Foreground: {foreground}</span>
			<br />
			<span class="font-bold">Background: {foreground}</span>
		</div>
	</div>
</main>
