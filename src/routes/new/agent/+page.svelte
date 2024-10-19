<script lang="ts">
	import type { PageData } from './$types';

	export let data;
	let temp: number = 4;
	let tempAbilityIDs: number[] = [];
</script>

<form action="" class="flex flex-col w-1/2 p-10">
	<label for="id">Agent ID</label>
	<input type="text" id="name" value={data.lastAgentId + 1} />
	<label for="name">Agent Name</label>
	<input type="text" name="name" />

	<label for="role">Agent Role</label>
	<select name="role">
		{#if data.agentRoles}
			<option hidden selected />
			{#each data.agentRoles as agentRole}
				<option value={agentRole.RoleID}>{agentRole.Name}</option>
			{/each}
		{:else}
			<option selected />
		{/if}
	</select>
	<label for="ability-count">Ability Count</label>
	<input type="text" name="ability-count" bind:value={temp} />
	{#each { length: temp } as _, i}
		<label for="abilityId">Ability ID</label>
		<input type="text" id="abilityId" bind:value={tempAbilityIDs[i]} placeholder={i.toString()} />
		<label for="abilityName">Ability Name</label>
		<input type="text" name="abilityName" />
		<label for="abilityNameID">Ability Name ID</label>
		<input type="text" name="abilityNameID" />
	{/each}
</form>
