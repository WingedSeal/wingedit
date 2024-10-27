<script lang="ts">
	import type { Ability, Agent, GameInfo, Grade, Lineup } from '$lib/server/db/types';
	import { isPopupShow } from '$lib/components/Popup.svelte';
	import type { Writable } from 'svelte/store';
	interface Props {
		lineups: Lineup[];
		lineupIndex: number;
		gameInfo: GameInfo;
	}

	let { lineups, lineupIndex = $bindable(), gameInfo }: Props = $props();

	const getDetails = (lineup: Lineup) => {
		return {
			ability: gameInfo.abilities[lineup.AgentID][lineup.AbilityID].Name,
			grade: gameInfo.grades[lineup.GradeID].Name,
			side: gameInfo.sides[lineup.SideID].Name,
			from: gameInfo.mapPositions[lineup.MapID][lineup.FromMapPositionID].Callout,
			to: gameInfo.mapPositions[lineup.MapID][lineup.ToMapPositionID].Callout,
			timeToLand: lineup.TimeToLand,
			difficulty: gameInfo.grades[lineup.Difficulty].Name
		};
	};

	const details = $derived(
		lineups.map((lineup) => {
			return getDetails(lineup);
		})
	);
</script>

<table>
	<thead>
		<tr>
			<th>Ability</th>
			<th>Grade</th>
			<th>Side</th>
			<th>From</th>
			<th>To</th>
			<th>Time to land</th>
			<th>Difficulty</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each details as detail, i}
			<tr>
				<td>
					{detail.ability}
				</td>
				<td>
					{detail.grade}
				</td>
				<td>
					{detail.side}
				</td>
				<td>
					{detail.from}
				</td>
				<td>
					{detail.to}
				</td>
				<td>
					{detail.timeToLand}s
				</td>
				<td>
					{detail.difficulty}
				</td>
				<td>
					<button
						class="w-6 h-6 rounded-md bg-purple-300"
						aria-label="open lineup"
						onclick={() => {
							lineupIndex = i;
							$isPopupShow = true;
						}}
					>
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="css">
	table,
	th,
	td {
		border: 1px solid;
		padding: 1rem;
	}
</style>
