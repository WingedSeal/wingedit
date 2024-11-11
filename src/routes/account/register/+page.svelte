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
	<div class="bg-gray-50 rounded-md p-9 space-y-10 font-medium">
		<h1 class="text-center font-bold">Register</h1>
		<form method="post" class="flex flex-col m-5" use:enhance>
			<label for="username">Username</label>
			<input
				name="username"
				id="username"
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3"
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
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3"
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
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3"
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
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3"
				placeholder="ReferralCode"
				bind:value={$form.referralCode}
			/>
			{#if $errors.referralCode}
				<small>{$errors.referralCode[0]}</small>
			{/if}

			<button
				class=" bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-4"
			>
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
