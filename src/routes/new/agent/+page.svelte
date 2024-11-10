<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getAgentSchema, DEFAULT_ABILITY_COUNT } from '$lib/schema';
	import { writable } from 'svelte/store';
	import '$lib/styles/form.scss';

	const schema = getAgentSchema();
	const { data } = $props();
	const { form, errors, enhance } = superForm(data.form, {
		validators: zodClient(schema),
		validationMethod: 'auto',
		dataType: 'json',
		resetForm: false
	});

	const updateFormAbilities = (_abilityCount: number) => {
		$form.abilities.length = _abilityCount;
		for (let i = 0; i < _abilityCount; i++) {
			$form.abilities[i] ??= { abilityName: '', abilityIcon: null as unknown as File };
		}
	};
	updateFormAbilities(DEFAULT_ABILITY_COUNT);
	const abilityCount = writable(DEFAULT_ABILITY_COUNT);
	abilityCount.subscribe(updateFormAbilities);

	if (!$form.agentID) $form.agentID = data.lastAgentId + 1;
</script>

{#snippet uploadFile(_for: 'agentIcon' | 'agentImage', text: string)}
	<label for={_for} class="absolute top-2 left-2 main-label z-30 text-outline">{text}</label>
	<input
		type="file"
		name={_for}
		id={_for}
		oninput={(e) => ($form[_for] = e.currentTarget.files?.item(0) as File)}
		accept="image/jpeg, image/png, image/webp"
		class="sr-only"
		aria-invalid={$form[_for] ? 'true' : undefined}
	/>
	<label for={_for} class="absolute top-0 left-0 w-full h-full cursor-pointer z-20"></label>
	{#if $form[_for]}
		<img
			class="absolute top-0 left-0 w-full h-full z-10"
			class:object-contain={_for === 'agentImage'}
			src={URL.createObjectURL($form[_for])}
			alt={text}
		/>
	{/if}
	<label for={_for} class="error absolute bottom-1 left-1 z-20 text-outline">
		TEST
		{#if $errors[_for]}
			{$errors[_for][0]}
		{/if}
	</label>
{/snippet}

<form method="post" use:enhance class="h-dvh-nav w-dvw p-12 flex" enctype="multipart/form-data">
	<div class="h-full flex flex-col">
		<div class="flex flex-row gap-4 bg-blue-200 h-full">
			<div class="flex flex-col h-full min-w-80">
				<div class="aspect-square p-2">
					<div class="w-full h-full relative bg-black">
						{@render uploadFile('agentIcon', 'Agent Icon')}
					</div>
				</div>
				<label for="agentID" class="main-label">Agent ID</label>
				<input
					name="agentID"
					type="number"
					step="1"
					min="1"
					bind:value={$form.agentID}
					aria-invalid={$errors.agentID ? 'true' : undefined}
				/>
				<label for="agentID" class="error">
					{#if $errors.agentID}
						{$errors.agentID[0]}
					{/if}
				</label>

				<label for="agentName" class="main-label">Agent Name</label>
				<input
					name="agentName"
					type="text"
					bind:value={$form.agentName}
					aria-invalid={$errors.agentName ? 'true' : undefined}
					placeholder="Name"
				/>
				<label for="agentName" class="error">
					{#if $errors.agentName}
						{$errors.agentName[0]}
					{/if}
				</label>

				<label for="agentRole" class="main-label">Agent Role</label>
				<select
					name="agentRole"
					bind:value={$form.agentRole}
					aria-invalid={$errors.agentRole ? 'true' : undefined}
				>
					<option hidden selected value={0}>- Select a Role -</option>
					{#each Object.values(data.agentRoles) as agentRole}
						<option value={agentRole.RoleID}>
							{agentRole.Name}
						</option>
					{/each}
				</select>
				<label for="agentRole" class="error">
					{#if $errors.agentRole}
						{$errors.agentRole[0]}
					{/if}
				</label>

				<h2 class="main-label">Ability Count</h2>
				<div class="grid grid-rows-2 grid-cols-3 rounded-xl overflow-clip">
					<button
						type="button"
						class="bg-red-300"
						aria-label="decrease"
						onclick={() => {
							$abilityCount = Math.max($abilityCount - 1, 0);
						}}
					>
						-
					</button>
					<div class="bg-blue-300 text-center py-1">
						{$abilityCount}
					</div>
					<button
						type="button"
						class="bg-green-300"
						aria-label="increase"
						onclick={() => $abilityCount++}>+</button
					>
					<button
						type="button"
						class="bg-purple-300 col-span-3"
						onclick={() => ($abilityCount = DEFAULT_ABILITY_COUNT)}>RESET</button
					>
				</div>
			</div>
			<div class="aspect-[1/2] relative max-h-full max-w-full bg-black">
				{@render uploadFile('agentImage', 'Agent Image')}
			</div>
		</div>
		<div class="bg-red-200 mt-2 flex">
			<button type="submit" class="m-auto py-4 px-12 rounded-xl bg-green-300"> CONFIRM </button>
		</div>
	</div>
	<div class=""></div>
</form>
