<script lang="ts">
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	} from 'chart.js';
	import { Line } from 'svelte-chartjs';
	import { lineData } from '$lib/const/statistics';
	import type { GetPlansResponse } from '../../../../routes/api/plans/[planId]/+server';
	export let allData: GetPlansResponse['data'];
	export let exerciseTypes: Array<{ name: string }> | null;
	let chosenExercise: string;
	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	);
	let repsArray: Array<number> = [];
	let weightsArray: Array<number> = [];
	let datesArray: Array<string> = [];
	let showWeight = false;

	const extractData = (data: GetPlansResponse['data'], chosenExercise: string) => {
		repsArray = [];
		weightsArray = [];
		datesArray = [];

		data?.forEach((plan) => {
			plan.Weeks.forEach((week) => {
				week.Days.forEach((day) => {
					day.Exercise_Detail.forEach((exercise) => {
						if (
							(chosenExercise && chosenExercise === exercise.exercise_type_name) ||
							!chosenExercise
						)
							exercise.Exercise_Detail_Sets.forEach((set) => {
								repsArray.push(set.reps);
								weightsArray.push(set.weight);
								datesArray.push(set.creation_date.slice(5, 10).replace('T', ' '));
							});
					});
				});
			});
		});
		lineData.labels = datesArray;
		lineData.datasets[0].data = repsArray;
		lineData.datasets[1].data = weightsArray;
	};
	$: extractData(allData, chosenExercise);
	$: console.log(exerciseTypes);

	// 1. Create a select for choosing exercise type
	// 2. Create a checkbox for showing or not showing weights data
</script>

<div class="line-container">
	{#if exerciseTypes}
		<select bind:value={chosenExercise}>
			<option value="" disabled selected>Exercise</option>
			{#each exerciseTypes as exercise}
				<option value={exercise.name}>{exercise.name}</option>
			{/each}
		</select>
	{/if}

	<Line
		data={{ labels: lineData.labels, datasets: lineData.datasets.slice(1, 2) }}
		options={{
			responsive: true,
			color: '#E4E4E7',
			scales: {
				y: {
					ticks: { color: '#E4E4E7' }
				},
				x: {
					ticks: { color: '#E4E4E7' }
				}
			}
		}}
	/>
	<Line
		data={{ labels: lineData.labels, datasets: lineData.datasets.slice(0, 1) }}
		options={{
			responsive: true,
			color: '#E4E4E7',
			scales: {
				y: {
					ticks: { color: '#E4E4E7' }
				},
				x: {
					ticks: { color: '#E4E4E7' }
				}
			}
		}}
	/>
</div>

<style lang="postcss">
	.line-container {
		padding: var(--size-fluid-2) 0;
		height: 100%;
		width: 100%;
		gap: var(--size-4);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
