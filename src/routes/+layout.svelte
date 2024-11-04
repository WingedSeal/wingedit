<script lang="ts">
	import '../app.scss';
	import { type Snippet } from 'svelte';
	import NavBar from './NavBar.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<NavBar />
{@render children?.()}
