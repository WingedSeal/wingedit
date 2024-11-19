<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { registerSchema as schema } from '$lib/schema';
	let { data } = $props();

	const { form, errors, message, enhance } = superForm(data.form, {
		validators: zodClient(schema)
	});
	$form.referralCode = $page.url.searchParams.get('code') || '';
</script>

<div class="flex items-center justify-center min-h-dvh-nav bg-primary-light">
	<div class="bg-white p-8 rounded-lg max-w-md w-full text-left shadow-lg">
		<h1 class="text-2xl font-semibold text-center">Register</h1>
		<form method="post" class="flex flex-col m-3 space-y-3" use:enhance>
			<label class="text-left font-medium mb-1" for="username">Username</label>
			<input
				name="username"
				id="username"
				class="border border-gray-300 rounded-md px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Username"
				bind:value={$form.username}
			/>
			{#if $errors.username}
				<small>{$errors.username[0]}</small>
			{/if}

			<label class="text-left font-medium mb-1" for="password">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				class="border border-gray-300 rounded-md px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Password"
				bind:value={$form.password}
			/>
			{#if $errors.password}
				<small>{$errors.password[0]}</small>
			{/if}

			<label class="text-left font-medium mb-1" for="confirmPassword">Confirm Password</label>
			<input
				type="password"
				name="confirmPassword"
				id="confirmPassword"
				class="border border-gray-300 rounded-md px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Confirm Password"
				bind:value={$form.confirmPassword}
			/>
			{#if $errors.confirmPassword}
				<small>{$errors.confirmPassword[0]}</small>
			{/if}

			<label class="text-left font-medium mb-1" for="referralCode">Referral Code</label>
			<input
				type="text"
				name="referralCode"
				id="referralCode"
				class="border border-gray-300 rounded-md px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="ReferralCode"
				bind:value={$form.referralCode}
			/>
			{#if $errors.referralCode}
				<small>{$errors.referralCode[0]}</small>
			{/if}

			<button class=" bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4">
				Continue
			</button>
		</form>

		{#if $message}
			{$message}
		{/if}
		<br />

		{#if $errors._errors}
			{$errors._errors}
		{/if}
		<br />

		<a
			href={'/account/signin' + $page.url.search}
			class="text-blue-500 text-center inline-block hover:underline">Already Has Account?</a
		>
	</div>
</div>

<svelte:head>
	<title>WingedIT • Register</title>
</svelte:head>
