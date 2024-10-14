<script lang="ts">
	import { error } from '@sveltejs/kit';

	export let form;
</script>

{form?.success}
<form method="post" action="?/upload" class="flex flex-col" enctype="multipart/form-data">
	<label for="file-upload">select file</label>
	<input type="file" name="file-upload" />
	<button type="submit" class="bg-red-300">button</button>
</form>

{#if form?.error}
	<p class="text-red-500">{form?.message}</p>
{/if}
