<script lang="ts">
	import Privilege from '$lib/privilege';
	import type { PrivilegeRole, UserInfo } from '$lib/server/db/types';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import icon from '$lib/assets/images/wingedit.webp';

	type Props = {
		user: UserInfo | null;
		privileges: { [privilege: string]: PrivilegeRole };
	};
	const { user, privileges }: Props = $props();
</script>

<nav class="w-full h-nav bg-plain-dark sticky flex flex-row p-2 z-30">
	<a href="/" class="mr-4 ml-12 aspect-square rounded-lg">
		<img src={icon} alt="wingedit icon" class="h-full aspect-square rounded-lg bg-plain-light" />
	</a>
	<a
		href="/"
		class="font-bold text-4xl text-plain-light mr-auto h-full flex border-t-2 border-b-2 rounded-md"
		tabindex="-1"
	>
		<h1 class="my-auto block tracking-[0.2em] font-bold">WingedIT</h1>
	</a>
	<a
		href="/lineups"
		class="bg-gradient-to-t from-secondary-contrast via-secondary-dark via-20% to-secondary rounded-xl h-full px-20 flex mr-8 hover:bg-gradient-to-b"
	>
		<h2 class="my-auto text-3xl font-bold px-4 rounded-lg tracking-widest">Lineups</h2>
	</a>
	{#if user && user.privilege >= Privilege.Member}
		<div class="relative dropdown h-5/6 my-auto mr-4 flex">
			<a
				href="/new"
				class="bg-secondary relative px-4 flex rounded-xl z-30 transition-all duration-100 hover:bg-secondary-dark"
			>
				<h2 class="text-2xl text-primary-dark tracking-wide my-auto font-bold">New</h2>
			</a>
			<div
				class="absolute top-[calc(100%+1rem)] left-1/2 scale-y-0 -translate-y-1/2 -translate-x-1/2
				transition-all ease-in duration-100 dropdown-content"
			>
				<div
					class="absolute h-[calc(100%+2.5rem)] w-[calc(100%+2rem)] top-1/2 left-1/2 -translate-y-[calc(50%+0.5rem)]
					-translate-x-1/2 -z-10"
				></div>
				{#snippet newButton(href: string, name: string)}
					<a
						{href}
						class="w-full text-center py-4 px-20 bg-primary font-bold tracking-wide text-lg text-primary-dark rounded-lg hover:bg-primary-contrast hover:text-white"
					>
						{name}
					</a>
				{/snippet}
				<div class="bg-plain-dark rounded-md flex flex-col p-6 gap-4">
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
			class="bg-plain-light rounded-full aspect-square h-full flex z-10"
		>
			<i class="fa-solid fa-user text-4xl text-primary-dark m-auto"></i>
		</a>
		<div
			class="absolute top-[calc(100%+1rem)] right-0 scale-y-0 -translate-y-1/2 transition-all ease-in duration-100 dropdown-content"
		>
			<div
				class="absolute h-[calc(100%+2.5rem)] w-[calc(100%+2rem)] top-1/2 right-0 -translate-y-[calc(50%+0.5rem)] translate-x-2 -z-10"
			></div>
			<div class="bg-primary rounded-md flex flex-col overflow-hidden">
				{#if user}
					<div class="flex bg-secondary p-4">
						<a href="/account" aria-label="account" class="mr-8" tabindex="-1">
							<i class="fa-solid fa-user text-8xl text-primary-dark aspect-auto"></i>
						</a>
						<div class="flex flex-col">
							<h2 class="font-bold text-2xl text-primary-dark">
								<a href="/account" tabindex="-1">{user.username}</a>
							</h2>
							<h3 class="text-lg mb-auto text-primary-contrast">
								{privileges[user.privilege].RoleName}
							</h3>
							<a
								href="/account/signout"
								class="inline-block text-primary-contrast"
								data-sveltekit-preload-data="tap"
								data-sveltekit-reload>Log out</a
							>
						</div>
					</div>
					<a
						href="/account/invite"
						class="rounded-md mt-4 mx-2 text-center bg-primary-dark text-plain-light">Invite</a
					>
					{#if user.privilege >= Privilege.Admin}
						<ul class="flex flex-col p-2 m-auto w-full">
							<li class="text-primary-dark">
								<a href="/admin/database">{'> '}Database</a>
							</li>
							<li class="text-primary-dark"><a href="/admin/images">{'> '}Images</a></li>
						</ul>
					{/if}
				{:else}
					<div class="p-4 flex flex-col items-center bg-plain-dark shadow-md gap-3">
						<a
							href="/account/signin"
							class="inline-block text-nowrap text-center w-full bg-primary hover:bg-primary-contrast rounded-lg px-6 py-3 text-primary-dark shadow-lg transition-all duration-150 font-bold"
						>
							SIGN IN
						</a>

						<a
							href="/account/register"
							class="inline-block text-nowrap text-center bg-primary hover:bg-primary-contrast rounded-lg px-6 py-3 text-primary-dark shadow-lg transition-all duration-150 w-full font-bold"
						>
							REGISTER
						</a>
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

	.dropdown-content:has(a:focus) {
		--tw-scale-y: 1;
		--tw-translate-y: 0%;
	}
</style>
