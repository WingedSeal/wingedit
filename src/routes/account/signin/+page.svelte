<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import { superForm } from 'sveltekit-superforms';
	export let data;

	const { form, errors, message, enhance } = superForm(data.form);
	$: if ($message?.redirect) {
		if (browser) {
			goto('/' + ($page.url.searchParams.get('redirectTo') || ''));
		} else {
			redirect(302, '/' + ($page.url.searchParams.get('redirectTo') || ''));
		}
	}
</script>

<h1>Sign in</h1>
<form method="post" class="flex flex-col m-5" use:enhance>
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
	<button>Continue</button>
</form>

<form method="post" use:enhance action="/account/signout">
	<button>Sign out</button>
</form>
{#if $message}
	{$message}
{/if}
<br />
{#if $errors._errors}
	{$errors._errors}
{/if}
<br />

<a href={'/account/signup' + $page.url.search}>No Account?</a>
