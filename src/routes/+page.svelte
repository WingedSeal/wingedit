<script lang="ts">
	export let data;
</script>

IJAY

<br />
{#if data.user}
	You are signed in as {data.user.username} ({data.privileges[data.user.privilege].RoleName})
{:else}
	You are not signed in
{/if}
