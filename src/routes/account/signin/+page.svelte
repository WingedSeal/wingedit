<script lang="ts">
	import { enhance } from '$app/forms';
	export let data;
	export let form;
</script>

<h1>Sign in</h1>
<form method="post" use:enhance action="?/signin">
	<label for="username">Username</label>
	<input name="username" id="username" value="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" value="password" /><br />
	<button>Continue</button>
</form>
<br />
{form?.message}
<br />
{#if data.username}
	WELCOME {data.username}
{:else}
	YOU ARE NOT SIGNED IN
{/if}
