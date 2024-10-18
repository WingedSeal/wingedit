<script src="ts">
	export let data;
</script>

IJAY

<br />
{#if data.user}
	You are signed in as {data.user.username}
{:else}
	You are not signed in
{/if}
