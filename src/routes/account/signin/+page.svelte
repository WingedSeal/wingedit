<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signinSchema as schema } from '$lib/schema';
	let { data } = $props();

	const { form, errors, enhance } = superForm(data.form, {
		validators: zodClient(schema)
	});
</script>

<!-- all container to make it be at the center-->
<div class="flex items-center justify-center min-h-dvh-nav bg-gray-600">
	<!-- smaller container-->
	<div class="bg-white p-8 rounded-lg max-w-md w-full text-center">
		<h1 class="text-2xl font-semibold mb-6">Sign in</h1>

		<form method="post" class="flex flex-col" use:enhance>
			<label for="username" class="text-left font-medium mb-1">Username</label>
			<input
				name="username"
				id="username"
				bind:value={$form.username}
				class="border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			{#if $errors.username}
				<small class="text-red-500 text-left mb-2">{$errors.username[0]}</small>
			{/if}

			<label for="password" class="text-left font-medium mb-1">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				bind:value={$form.password}
				class="border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			{#if $errors.password}
				<small class="text-red-500 text-left mb-2">{$errors.password[0]}</small>
			{/if}

			<button
				class="bg-blue-500 text-white rounded-md py-2 mt-2 hover:bg-blue-600 transition-colors"
				>Continue</button
			>
		</form>

		<!-- {#if $errors._errors}
			<div class="text-red-500 mt-4">{$errors._errors}</div>
		{/if} -->
		<a
			href={'/account/register' + $page.url.search}
			class="text-blue-500 mt-4 inline-block hover:underline"
		>
			Don't have account? Sign up
		</a>
	</div>
</div>
