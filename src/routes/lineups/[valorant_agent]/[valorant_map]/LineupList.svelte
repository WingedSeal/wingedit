<script lang="ts">
	import type { Ability, Agent, GameInfo, Grade, Lineup } from '$lib/server/db/types';
	interface Props {
		lineups: Lineup[];
		isPopupHidden: boolean;
		lineupIndex: number;
		gameInfo: GameInfo;
	}

	let {
		lineups,
		isPopupHidden = $bindable(),
		lineupIndex = $bindable(),
		gameInfo
	}: Props = $props();

	type Details = {
		grade: Grade;
		ability: Ability;
		agent: Agent;
	};

	const getDetails = (lineup: Lineup): Details => {
		return {
			grade: gameInfo.grades[lineup.GradeID],
			ability: gameInfo.abilities[lineup.AgentID][lineup.AbilityID],
			agent: gameInfo.agents[lineup.AgentID]
		};
	};

	const details = lineups.map((lineup) => {
		return getDetails(lineup);
	});
</script>

{#each lineups as lineup, i}
	<li>
		{i + 1}.{')'}
		ID: {lineup.ID}, grade: {details[i].grade.Name}, agent: {details[i].agent.Name}, ability: {details[
			i
		].ability.Name}
		<button
			class="w-4 h-4 bg-violet-800"
			aria-label="open"
			onclick={() => {
				isPopupHidden = !isPopupHidden;
				lineupIndex = i;
			}}
		></button>
	</li>
{/each}
ID
