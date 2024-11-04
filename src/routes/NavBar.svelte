<script lang="ts">
	import Privilege from '$lib/privilege';
	import type { PrivilegeRole, UserInfo } from '$lib/server/db/types';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	type Props = {
		user: UserInfo | null;
		privileges: { [privilege: string]: PrivilegeRole };
	};
	const { user, privileges }: Props = $props();
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
		class="font-bold text-4xl text-white mr-auto h-full flex border-t-2 border-b-2 rounded-md"
	>
		<h1 class="my-auto block tracking-[0.2em]">WingedIT</h1>
	</a>
	<a href="/lineups" class="bg-blue-800 text-white border-4 rounded-xl h-full px-20 flex mr-8">
		<h2 class="my-auto text-3xl font-bold border-l-4 border-r-4 px-4 rounded-lg tracking-widest">
			Lineups
		</h2>
	</a>
	{#if user && user.privilege >= Privilege.Member}
		<div class="relative dropdown h-5/6 my-auto mr-4 flex">
			<a href="/new" class="bg-blue-800 relative px-4 flex border-2 rounded-xl z-10">
				<h2 class="text-2xl text-white tracking-wide">New</h2>
			</a>
			<div
				class="absolute top-[calc(100%+1rem)] left-1/2 scale-y-0 -translate-y-1/2 -translate-x-1/2
				transition-all ease-in duration-100 dropdown-content"
			>
				<div
					class="absolute h-[calc(100%+2.5rem)] w-[calc(100%+2rem)] top-1/2 left-1/2 -translate-y-[calc(50%+0.5rem)]
					-translate-x-1/2 -z-10 bg-red-300 opacity-30"
				></div>
				{#snippet newButton(href: string, name: string)}
					<a
						{href}
						class="w-full text-center py-4 px-20 bg-blue-400 font-bold tracking-wide text-lg"
					>
						{name}
					</a>
				{/snippet}
				<div class="bg-blue-200 rounded-md flex flex-col p-4 gap-2">
					{@render newButton('/new/lineup', 'Lineup')}
					{#if user.privilege >= Privilege.Moderator}
						{@render newButton('/new/agent', 'Agent')}
						{@render newButton('/new/map', 'Map')}
					{/if}
				</div>
			</div>
		</div>
	{/if}
	<div class="ml-16 mr-4 relative dropdown flex">
		<a
			href="/account"
			aria-label="user icon"
			class="bg-slate-50 rounded-full aspect-square h-full flex z-10"
		>
			<i class="fa-solid fa-user text-4xl text-slate-700 m-auto"></i>
		</a>
		<div
			class="absolute top-[calc(100%+1rem)] right-0 scale-y-0 -translate-y-1/2 transition-all ease-in duration-100 dropdown-content"
		>
			<div
				class="absolute h-[calc(100%+2.5rem)] w-[calc(100%+2rem)] top-1/2 right-0 -translate-y-[calc(50%+0.5rem)] translate-x-2 -z-10 bg-red-300 opacity-30"
			></div>
			<div class="bg-blue-200 rounded-md flex flex-col overflow-hidden">
				{#if user}
					<div class="flex bg-blue-100 p-4">
						<a href="/account" aria-label="account">
							<i class="fa-solid fa-user text-8xl text-slate-700 mr-8 aspect-auto"></i></a
						>
						<div class="flex flex-col">
							<h2 class="font-bold text-2xl"><a href="/account">{user.username}</a></h2>
							<h3 class="text-lg mb-auto">{privileges[user.privilege].RoleName}</h3>
							<a href="/account/signout" class="inline-block" data-sveltekit-reload>Log out</a>
						</div>
					</div>
					<a href="/account/invite" class="rounded-md my-1 mx-2 text-center bg-blue-800 text-white"
						>Invite</a
					>
					{#if user.privilege >= Privilege.Admin}
						<ul class="flex flex-col p-2 m-auto">
							<li class=""><a href="/admin/database">Database</a></li>
							<li class=""><a href="/admin/images">Images</a></li>
						</ul>
					{/if}
				{:else}
					<div class="p-4">
						<a href="/account/signin" class="inline-block text-nowrap">SIGN IN</a>
						<a href="/account/signup" class="inline-block text-nowrap">SIGN UP</a>
					</div>
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
