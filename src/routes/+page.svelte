<script lang="ts">
	let { data } = $props();
</script>

IJAY

<br />
{#if data.user}
	You are signed in as {data.user.username} ({data.privileges[data.user.privilege].RoleName})
{:else}
	You are not signed in
{/if}

<svelte:head>
	<title>WingedIT</title>
	<meta
		name="description"
		content="WingedIT, a Valorant Lineups Archive, is designed for ease of use and the sheer speed for our users to access a lineup even during the game."
	/>
</svelte:head>
