<script lang="ts">
	import colors from '$lib/colors';
	// let colors = { ..._colors, white: '#FFFFFF', black: '#000000' };
	let foreground = $state<keyof typeof colors>(Object.keys(colors)[0] as keyof typeof colors);
	let background = $state<keyof typeof colors>(Object.keys(colors)[0] as keyof typeof colors);
	let opacity = $state(100);
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
			<div class="flex">
				<label for="opacity" class="font-bold">Opacity</label>
				<input type="number" min="0" max="100" bind:value={opacity} class="text-right" />%
			</div>
			<input type="range" name="opacity" min="0" max="100" bind:value={opacity} />
		</div>
		<div class="min-w-24 bg-{background} text-{foreground} p-8">
			<p style="opacity: {opacity / 100};">
				<span>Foreground: {foreground} - {colors[foreground]}</span>
				<br />
				<span class="font-bold">Background: {background} - {colors[background]}</span>
			</p>
		</div>
	</div>
</main>
