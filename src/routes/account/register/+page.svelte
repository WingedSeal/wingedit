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

<div class="flex items-center justify-center h-dvh-nav bg-slate-600">
	<div class="bg-gray-50 rounded-lg p-8 font-medium max-w-md w-full">
		<h1 class="text-2xl font-semibold text-center">Register</h1>
		<form method="post" class="flex flex-col m-8 space-y-5" use:enhance>
			<label for="username">Username</label>
			<input
				name="username"
				id="username"
				class="border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Username"
				bind:value={$form.username}
			/>
			{#if $errors.username}
				<small>{$errors.username[0]}</small>
			{/if}

			<label for="password">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				class="border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Password"
				bind:value={$form.password}
			/>
			{#if $errors.password}
				<small>{$errors.password[0]}</small>
			{/if}

			<label for="confirmPassword">Confirm Password</label>
			<input
				type="password"
				name="confirmPassword"
				id="confirmPassword"
				class="border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Confirm Password"
				bind:value={$form.confirmPassword}
			/>
			{#if $errors.confirmPassword}
				<small>{$errors.confirmPassword[0]}</small>
			{/if}

			<label for="referralCode">Referral Code</label>
			<input
				type="text"
				name="referralCode"
				id="referralCode"
				class="border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
			class="no-underline hover:underline hover:text-red-600">Already Has Account?</a
		>
	</div>
</div>

<svelte:head>
	<title>WingedIT • Register</title>
</svelte:head>
