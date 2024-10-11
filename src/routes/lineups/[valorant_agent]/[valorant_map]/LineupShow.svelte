<script lang="ts"></script>

<div class="w-full h-full lineup-grid grid gap-x-6 gap-y-6 py-4 px-36">
	<div class="how-lineup relative">
		<div class="w-full h-[90%] absolute bottom-0">
			<div class="w-full h-full bg-red-400 absolute flex">
				<p class="m-auto">How to lineup</p>
			</div>
		</div>
		<div class="absolute text-7xl -top-3 -left-1 font-bold text-primary">MAP AGENT_NAME</div>
	</div>
	<div class="throw-gif relative">
		<div class="w-full h-full bg-purple-300 absolute flex">
			<p class="m-auto">THROW GIF</p>
		</div>
	</div>
	<div class="land-spot relative">
		<div class="w-full h-full bg-green-300 absolute flex">
			<p class="m-auto">LAND SPOT</p>
		</div>
	</div>
	<div class="lineup-text relative">
		<div
			class="w-full h-full absolute grid grid-cols-1 grid-rows-3 flex-col
            uppercase text-4xl text-primary font-bold content-center tracking-widest"
		>
			<h2>normal throw</h2>
			<h2>grade: S</h2>
			<h2>description</h2>
		</div>
	</div>
	<div class="first-person relative">
		<div class="w-full h-full bg-blue-300 absolute flex">
			<p class="m-auto">FIRST PERSON</p>
		</div>
	</div>
	<div class="third-person relative">
		<div class="w-full h-full bg-fuchsia-300 absolute flex">
			<p class="m-auto">THIRD PERSON</p>
		</div>
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
