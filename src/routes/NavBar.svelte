<script lang="ts">
	import { type UserInfo } from '$lib/server/db/types';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	const { user }: { user: UserInfo | null } = $props();
</script>

<nav class="w-full h-nav bg-blue-900 sticky flex flex-row p-2 z-10">
	<a href="/">
		<img
			src="/favicon-512.png"
			alt="wingedit icon"
			class="h-full aspect-square mr-4 ml-12 rounded-lg"
		/>
	</a>
	<a
		href="/"
		class="font-bold tracking-widest text-4xl text-white mr-auto h-full flex border-t-2 border-b-2 rounded-md"
	>
		<h1 class="my-auto block">WingedIT</h1>
	</a>
	<a href="/lineups" class="bg-blue-800 text-white border-4 rounded-xl h-full px-20 flex mr-4">
		<h2 class="my-auto text-3xl font-bold border-l-4 border-r-4 px-4 rounded-lg">Lineups</h2>
	</a>
	<div class="ml-4 mr-4 relative dropdown">
		<button aria-label="user icon" class="bg-slate-50 rounded-full aspect-square h-full">
			<i class="fa-solid fa-user text-4xl text-slate-700"></i>
		</button>
		<div
			class="absolute top-[calc(100%+1rem)] right-0 scale-y-0 -translate-y-1/2 transition-all ease-in duration-100 dropdown-content"
		>
			<div
				class="absolute h-[calc(100%+3rem)] w-[calc(100%+2rem)] top-1/2 right-0 -translate-y-[calc(50%+1rem)] translate-x-2 -z-10 bg-red-300 opacity-30"
			></div>
			<div class="bg-green-300 w-72 h-72 rounded-md p-2 flex flex-col">
				{#if user}
					<a href="/account/signout" class="inline-block" data-sveltekit-reload>SIGN OUT</a>
				{:else}
					<a href="/account/signin" class="inline-block">SIGN IN</a>
					<a href="/account/signup" class="inline-block">SIGN UP</a>
				{/if}
			</div>
		</div>
	</div>
</nav>

<style>
	.dropdown:hover .dropdown-content {
		--tw-scale-y: 1;
		--tw-translate-y: 0%;
	}
</style>
