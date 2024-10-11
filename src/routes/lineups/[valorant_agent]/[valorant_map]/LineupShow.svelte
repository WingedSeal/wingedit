<script lang="ts">
	import ElementFit from '$lib/ElementFit.svelte';
</script>

<div class="lineup-grid grid gap-6 m-auto bg-yellow-300">
	<div class="how-lineup relative flex flex-col">
		<div class=""></div>
		<canvas class="aspect-video bg-black" />
		<div class="absolute text-7xl -top-3 -left-1 font-bold text-primary">MAP AGENT_NAME</div>
	</div>
	<div class="throw-gif flex aspect-video">
		<canvas class="aspect-video bg-black" />
	</div>
	<div class="land-spot flex aspect-video">
		<canvas class="aspect-video bg-black" />
	</div>
	<div
		class="lineup-text grid grid-cols-1 grid-rows-3 aspect-video
            uppercase text-4xl text-primary font-bold content-center tracking-widest"
	>
		<h2>normal throw</h2>
		<h2>grade: S</h2>
		<h2>description</h2>
	</div>
	<div class="first-person flex aspect-video">
		<canvas class="aspect-video bg-black" />
	</div>
	<div class="third-person flex aspect-video">
		<canvas class="aspect-video bg-black" />
	</div>
</div>

<style lang="css">
	.lineup-grid {
		grid-template-areas:
			'how-lineup how-lineup throw-gif'
			'how-lineup how-lineup land-spot'
			'lineup-text first-person third-person';
	}

	.how-lineup {
		grid-area: how-lineup;
	}

	.throw-gif {
		grid-area: throw-gif;
	}
	.land-spot {
		grid-area: land-spot;
	}

	.lineup-text {
		grid-area: lineup-text;
	}

	.first-person {
		grid-area: first-person;
	}

	.third-person {
		grid-area: third-person;
	}
</style>
