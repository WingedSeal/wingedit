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

	const getDetails = (lineup: Lineup, index: number) => {
		return {
			index: index,
			lineup: lineup,
			ability: abilities[lineup.AbilityID].Name,
			grade: gameInfo.grades[lineup.GradeID].Name,
			side: gameInfo.sides[lineup.SideID].Name,
			from: gameInfo.mapPositions[lineup.MapID][lineup.FromMapPositionID].Callout,
			to: gameInfo.mapPositions[lineup.MapID][lineup.ToMapPositionID].Callout,
			difficulty: gameInfo.grades[lineup.Difficulty].Name
		};
	};

	type Detail = ReturnType<typeof getDetails>;

	const details = lineups.map((lineup, index) => {
		return getDetails(lineup, index);
	});
	let sortedDetails = $state(details);
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
		sortedDetails = details.toSorted((a, b) => {
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

<table class="min-w-full divide-y divide-primary-dark bg-primary-light">
	<thead class="bg-primary">
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
	<tbody class="bg-white font-semibold">
		{#each sortedDetails as detail (detail.lineup.ID)}
			<tr class="hover:bg-primary-light duration-300">
				<td class="px-6 py-4 whitespace-nowrap text-sm text-plain-dark">
					{detail.lineup.ID}
				</td>
				<td class="px-6 py-4 whitespace-nowrap text-sm text-plain-dark">
					<img
						class="inline h-4 -translate-y-1 bg-slate-800 rounded-md"
						src="/api/image/agents/{lineups[detail.index].AgentID}/abilities/{lineups[detail.index]
							.AbilityID}.webp"
						alt={detail.ability}
					/>
					{detail.ability}
				</td>
				<td class="px-6 py-4 whitespace-nowrap text-sm text-plain-dark">
					{detail.grade}
				</td>
				<td class="px-6 py-4 whitespace-nowrap text-sm text-plain-dark">
					{detail.side}
				</td>
				<td class="px-6 py-4 whitespace-nowrap text-sm text-plain-dark">
					{detail.from}
				</td>
				<td class="px-6 py-4 whitespace-nowrap text-sm text-plain-dark">
					{detail.to}
				</td>
				<td class="px-6 py-4 whitespace-nowrap text-sm text-plain-dark">
					{detail.lineup.TimeToLand}s
				</td>
				<td class="px-6 py-4 whitespace-nowrap text-sm text-plain-dark">
					{detail.difficulty}
				</td>
				<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
					<button
						class="w-14 h-8 rounded-md bg-primary text-black font-bold hover:bg-primary-contrast transition-transform transform hover:scale-105 hover:text-white min-w-full"
						aria-label="open lineup"
						onclick={() => {
							lineupIndex = detail.index;
							$isPopupShow = true;
						}}
					>
						USE
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
