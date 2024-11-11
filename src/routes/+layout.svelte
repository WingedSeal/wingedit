<script lang="ts">
	import '../app.scss';
	import { onMount, type Snippet } from 'svelte';
	import type { PageData } from './$types';
	import NavBar from './NavBar.svelte';

	type Props = {
		children: Snippet;
		data: PageData;
	};

	let { children, data }: Props = $props();
</script>

<NavBar user={data.user} privileges={data.privileges} />
{@render children?.()}
