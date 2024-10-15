<script lang="ts">
	import { Grade, ThrowType } from './../../lineups/[valorant_agent]/[valorant_map]/types';
	export let form;
	export let data;
	const validate = () => {};
	const throw_types = Object(ThrowType);
</script>

{#if form?.success}
	SENT
{/if}
<form
	method="post"
	on:submit={validate}
	action="?/upload"
	class="flex flex-col w-1/2 p-10"
	enctype="multipart/form-data"
>
	<label for="agent">Agent</label>
	<select name="agent">
		{#each data.agents as agent}
			<option value={agent.ID}>{agent.Name}</option>
		{/each}
	</select>
	<label for="map">Map</label>
	<select name="map">
		{#each data.maps as map}
			<option value={map.ID}>{map.Name}</option>
		{/each}
	</select>
	<label for="ability">Ability</label>
	<select name="ability">
		<option value="placeholder">PLACEHOLDER</option>
	</select>
	<label for="throw-lineup">Throw Lineup</label>
	<input type="file" name="throw-lineup" />
	<label for="throw-gif">Throw Gif</label>
	<input type="file" name="throw-gif" />
	<label for="land-spot">Land Spot</label>
	<input type="file" name="land-spot" />
	<label for="throw-spot-first-person">Throw Spot First Person</label>
	<input type="file" name="throw-spot-first-person" />
	<label for="throw-spot-third-person">Throw Spot Third Person</label>
	<input type="file" name="throw-spot-third-person" />
	<label for="grade">Grade</label>
	<select name="grade">
		{#each Object.values(Grade) as grade}
			<option value={grade}>{grade}</option>
		{/each}
	</select>
	<label for="throw-type">Throw Type</label>
	<select name="throw-type">
		{#each Object.keys(ThrowType) as throw_type}
			<option value={throw_type}>{throw_types[throw_type]}</option>
		{/each}
	</select>
	<button type="submit" class="bg-red-300">button</button>
</form>

{#if form?.error}
	<p class="text-red-500">{form?.message}</p>
{/if}
