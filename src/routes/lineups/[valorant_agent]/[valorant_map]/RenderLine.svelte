<script lang="ts">
	import { isPopupShow } from '$lib/components/Popup.svelte';
	import type { Grade, Lineup } from '$lib/server/db/types';

	type Props = {
		lineup: Lineup;
		lineupIndex: number;
		index: number;
		grades: { [gradeID: number]: Grade };
	};
	let clientHeight = $state(0);
	let clientWidth = $state(0);
	const agentRadius = 2;
	const abilityRadius = 2;
	const lineWidth = 0.4;

	let { lineup, grades, lineupIndex = $bindable(), index }: Props = $props();

	const { from, to } = $derived.by(() => {
		let from = [(lineup.FromX * clientWidth) / 100, ((100 - lineup.FromY) * clientHeight) / 100];
		let to = [(lineup.ToX * clientWidth) / 100, ((100 - lineup.ToY) * clientHeight) / 100];
		const dx = from[0] - to[0];
		const dy = from[1] - to[1];
		const length = Math.sqrt(dx * dx + dy * dy);
		const radiusFrom = (agentRadius * clientHeight) / 100;
		const radiusTo = (abilityRadius * clientHeight) / 100;
		const abs_dx = Math.abs(dx);
		const abs_dy = Math.abs(dy);
		from[0] -= Math.sign(dx) * (abs_dy > abs_dx ? (radiusFrom * abs_dx) / abs_dy : radiusFrom);
		from[1] -= Math.sign(dy) * (abs_dx > abs_dy ? (radiusFrom * abs_dy) / abs_dx : radiusFrom);

		to[0] += (dx * radiusTo) / length;
		to[1] += (dy * radiusTo) / length;
		return { from, to };
	});

	const onClick = () => {
		lineupIndex = index;
		$isPopupShow = true;
	};
</script>

<div class="h-full w-full pointer-events-none absolute" bind:clientWidth bind:clientHeight>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		class="aspect-square absolute -translate-x-1/2 translate-y-1/2 cursor-pointer pointer-events-auto
					rounded-md border-solid agent"
		style="height: {agentRadius *
			2}%; left: {lineup.FromX}%; bottom: {lineup.FromY}%; border-width: {(clientHeight *
			lineWidth) /
			100}px;"
		src="/api/image/agents/{lineup.AgentID}/icon.webp"
		alt="Agent {lineup.AgentID}"
		onclick={onClick}
	/>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		class="aspect-square absolute -translate-x-1/2 translate-y-1/2 cursor-pointer pointer-events-auto
					rounded-[50%] border-solid bg-slate-900 border-slate-700 border-[1rem]"
		style="height: {abilityRadius *
			2}%; left: {lineup.ToX}%; bottom: {lineup.ToY}%; border-width: {(clientHeight * lineWidth) /
			100}px;"
		src="/api/image/agents/{lineup.AgentID}/abilities/{lineup.AbilityID}.webp"
		alt="Ability {lineup.AbilityID}"
		onclick={onClick}
	/>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<svg
		class="h-full w-full absolute cursor-pointer focus:outline-none"
		style="stroke: {grades[lineup.GradeID].Color}; stroke-width: {(clientHeight * lineWidth) /
			100};"
		onclick={onClick}
		role="button"
		tabindex="-1"
	>
		<polyline points={`${from} ${to}`} style="pointer-events: stroke;"></polyline>
	</svg>
</div>

<style lang="scss">
	.agent {
		background-image: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.25),
			rgba(100, 100, 100, 0.01)
		);
		border-color: rgba(200, 200, 200, 0.1);
	}
</style>
