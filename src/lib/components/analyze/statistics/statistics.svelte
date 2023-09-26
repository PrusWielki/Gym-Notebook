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
	import ExerciseModal from '$lib/components/modals/exercise_modal/exercise_modal.svelte';
	export let allData: GetPlansResponse['data'];
	export let exerciseTypes: Array<{ name: string }> | null;
	let chosenExercise: { exercise_type_name: string | null } = { exercise_type_name: null };
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
	let rpeArray: Array<number> = [];
	let dialogOpen: Array<boolean> = [false];

	const extractData = (data: GetPlansResponse['data'], chosenExercise: string | null) => {
		repsArray = [];
		weightsArray = [];
		datesArray = [];
		rpeArray = [];

		data?.forEach((plan) => {
			plan.Weeks.forEach((week) => {
				week.Days.forEach((day) => {
					day.Exercise_Detail.forEach((exercise) => {
						if (
							(chosenExercise && chosenExercise === exercise.exercise_type_name) ||
							chosenExercise === null
						) {
							exercise.Exercise_Detail_Sets.forEach((set) => {
								repsArray.push(set.reps);
								weightsArray.push(set.weight);
								rpeArray.push(set.rpe);
								datesArray.push(set.creation_date.slice(5, 10).replace('T', ' '));
							});
						}
					});
				});
			});
		});
		lineData.labels = datesArray;
		lineData.datasets[0].data = repsArray;
		lineData.datasets[1].data = weightsArray;
		lineData.datasets[2].data = rpeArray;
	};
	$: extractData(allData, chosenExercise.exercise_type_name);

	// 1. Create a select for choosing exercise type
</script>

<div class="line-container">
	<button on:click={() => (dialogOpen[0] = true)}
		>{chosenExercise.exercise_type_name || 'All'}</button
	>
	<ExerciseModal
		index={0}
		bind:dialogOpened={dialogOpen}
		exercises={exerciseTypes}
		bind:exercise={chosenExercise}
	/>
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
	<Line
		data={{ labels: lineData.labels, datasets: lineData.datasets.slice(2, 3) }}
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
	button {
		all: unset;
		width: 40%;
		background-color: var(--surface-3);
		font-size: var(--font-size-4);
		padding: var(--size-3) var(--size-2);
		text-align: center;
		@media (--md-n-below) {
			width: 80%;
			font-size: var(--font-size-1);
			padding: var(--size-2) var(--size-1);
		}
	}
</style>
