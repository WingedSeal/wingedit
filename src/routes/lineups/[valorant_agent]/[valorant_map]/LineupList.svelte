<script lang="ts">
	import type { Ability, GameInfo, Lineup } from '$lib/server/db/types';
	import { isPopupShow } from '$lib/components/Popup.svelte';

	interface Props {
		lineups: Lineup[];
		lineupIndex: number;
		gameInfo: GameInfo;
		abilities: { [abilityID: number]: Ability };
	}

	let { lineups, lineupIndex = $bindable(), gameInfo, abilities }: Props = $props();

	const getDetails = (lineup: Lineup) => {
		return {
			lineup: lineup,
			abilityNameID: abilities[lineup.AbilityID].NameID,
			ability: abilities[lineup.AbilityID].Name,
			grade: gameInfo.grades[lineup.GradeID].Name,
			side: gameInfo.sides[lineup.SideID].Name,
			from: gameInfo.mapPositions[lineup.MapID][lineup.FromMapPositionID].Callout,
			to: gameInfo.mapPositions[lineup.MapID][lineup.ToMapPositionID].Callout,
			difficulty: gameInfo.grades[lineup.Difficulty].Name
		};
	};

	type Detail = ReturnType<typeof getDetails>;

	let details = $state(
		lineups.map((lineup) => {
			return getDetails(lineup);
		})
	);

	const compareStr = (a: string, b: string) => (a > b ? 1 : -1);
	const sortFunc = (a: Detail, b: Detail): number => {
		switch (sortedBy) {
			case 'ID':
				return a.lineup.ID! - b.lineup.ID!;
			case 'Ability':
				return compareStr(a.ability, b.ability);
			case 'Grade':
				return b.lineup.GradeID - a.lineup.GradeID;
			case 'Side':
				return compareStr(a.side, b.side);
			case 'From':
				return compareStr(a.from, b.from);
			case 'To':
				return compareStr(a.to, b.to);
			case 'Time to land':
				return a.lineup.TimeToLand - b.lineup.TimeToLand;
			case 'Difficulty':
				return b.lineup.Difficulty - a.lineup.Difficulty;
		}
		throw new Error('Unexpected sortedBy');
	};

	let sortedBy = $state('ID');
	let isSortAscending = $state(true);
	const reSort = () => {
		details.sort((a, b) => {
			return (isSortAscending ? 1 : -1) * sortFunc(a, b);
		});
	};
	let getSortClass = (name: string) => {
		if (name !== sortedBy) return 'sort';
		if (isSortAscending) {
			return 'sort-up';
		} else {
			return 'sort-down';
		}
	};
</script>

{#snippet tableHead(name: string)}
	{@const sortClass = getSortClass(name)}
	<th
		>{name}
		<button
			aria-label={sortClass}
			onclick={() => {
				if (name !== sortedBy) {
					isSortAscending = true;
					sortedBy = name;
					reSort();
					return;
				}
				isSortAscending = !isSortAscending;
				reSort();
			}}
		>
			<i class="fa-solid fa-{sortClass}"></i>
		</button>
	</th>
{/snippet}

<table>
	<thead>
		<tr>
			{@render tableHead('ID')}
			{@render tableHead('Ability')}
			{@render tableHead('Grade')}
			{@render tableHead('Side')}
			{@render tableHead('From')}
			{@render tableHead('To')}
			{@render tableHead('Time to land')}
			{@render tableHead('Difficulty')}
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each details as detail, i (detail.lineup.ID)}
			<tr>
				<td>
					{detail.lineup.ID}
				</td>
				<td>
					<img
						class="inline h-4 -translate-y-1 bg-slate-800 rounded-md"
						src="/api/image/agents/{lineups[i].AgentID}/abilities/{lineups[i].AbilityID}.webp"
						alt={detail.abilityNameID}
					/>
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
					{detail.lineup.TimeToLand}s
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
