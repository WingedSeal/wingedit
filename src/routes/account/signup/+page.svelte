<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import { superForm } from 'sveltekit-superforms';

	export let data;
	let confirmPassword: HTMLInputElement;

	let confirmPasswordError: string | null = null;
	const { form, errors, message, enhance } = superForm(data.form);
	$: if ($message?.redirect) {
		if (browser) {
			goto('/' + ($page.url.searchParams.get('redirectTo') || ''));
		} else {
			redirect(302, '/' + ($page.url.searchParams.get('redirectTo') || ''));
		}
	}
	$form.referralCode = $page.url.searchParams.get('code') || '';
</script>

<h1>Sign up</h1>
<form
	method="post"
	class="flex flex-col m-5"
	use:enhance
	on:submit={(event) => {
		if (confirmPassword.value != $form.password) {
			confirmPasswordError = 'Passwords do not match.';
			event.preventDefault();
		}
	}}
>
	<label for="username">Username</label>
	<input name="username" id="username" bind:value={$form.username} />
	{#if $errors.username}
		<small>{$errors.username[0]}</small>
	{/if}

	<label for="password">Password</label>
	<input type="password" name="password" id="password" bind:value={$form.password} />
	{#if $errors.password}
		<small>{$errors.password[0]}</small>
	{/if}

	<label for="confirmPassword">Confirm Password</label>
	<input
		type="password"
		name="confirmPassword"
		id="confirmPassword"
		bind:value={$form.confirmPassword}
	/>
	{#if $errors.confirmPassword}
		<small>{$errors.confirmPassword[0]}</small>
	{/if}

	<label for="referralCode">Referral Code</label>
	<input type="text" name="referralCode" id="referralCode" bind:value={$form.referralCode} />
	{#if $errors.referralCode}
		<small>{$errors.referralCode[0]}</small>
	{/if}

	<button>Continue</button>
</form>

{#if $message}
	{$message}
{/if}
<br />

{#if $errors._errors}
	{$errors._errors}
{/if}
<br />

<a href={'/account/signin' + $page.url.search}>Already Has Account?</a>
