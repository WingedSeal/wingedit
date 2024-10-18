<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	export let form;
	export let data;
	$: if (form?.redirect) goto('/' + ($page.url.searchParams.get('redirectTo') || ''));
</script>

<h1>Sign up</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<button>Continue</button>
</form>

{form?.message}

<br />
{#if data.username}
	WELCOME {data.username}
{/if}
