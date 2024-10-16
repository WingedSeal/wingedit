<script lang="ts">
	import type { Ability, Agent, GameInfo, Grade, Lineup } from '$lib/server/db/types';
	import { v4 } from 'uuid';
	export let lineups: Lineup[];
	export let isPopupHidden: boolean;
	export let lineupIndex: number;
	export let gameInfo: GameInfo;
	export let details: Details[] = [];

	type Details = {
		grade: Grade;
		ability: Ability;
		agent: Agent;
	};

	const getDetails = (lineup: Lineup): Details => {
		return {
			grade: gameInfo.grades[lineup.GradeID],
			ability: gameInfo.abilities.get([lineup.AgentID, lineup.AbilityID].toString())!,
			agent: gameInfo.agents[lineup.AgentID]
		};
	};

	lineups.forEach((lineup, i) => {
		details[i] = getDetails(lineup);
	});
</script>

{#each lineups as lineup, i}
	<li>
		{i + 1}.{')'}
		UUID: {lineup.UUID}, grade: {details[i].grade.Name}, agent: {details[i].agent.Name}, ability: {details[
			i
		].ability.Name}
		<button
			class="w-4 h-4 bg-violet-800"
			on:click={() => {
				isPopupHidden = !isPopupHidden;
				lineupIndex = i;
			}}
		/>
	</li>
{/each}
