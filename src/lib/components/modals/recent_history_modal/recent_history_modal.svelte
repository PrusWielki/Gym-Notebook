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
	import { browser } from '$app/environment';
	import type { ExtractedExercises } from '../../../../routes/(protected)/analyze/types';
	import { showNotification } from '$lib/utils/show-notification';
	import notificationMessage from '$lib/store/notifications';

	export let modal: HTMLDialogElement;
	export let exerciseType: string;

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

	let color: string;
	let colorScheme: 'dark' | 'light' = 'dark';

	let repsArray: Array<number> = [];
	let weightsArray: Array<number> = [];
	let datesArray: Array<string> = [];
	let rpeArray: Array<number> = [];

	let data: ExtractedExercises;
	const extractData = (data: ExtractedExercises, chosenExercise: string | null) => {
		repsArray = [];
		weightsArray = [];
		datesArray = [];
		rpeArray = [];

		data.forEach((exercise) => {
			if (
				(chosenExercise && chosenExercise === exercise.exercise_type_name) ||
				chosenExercise === null
			) {
				repsArray.push(exercise.reps);
				weightsArray.push(exercise.weight);
				rpeArray.push(exercise.rpe);
				datesArray.push(exercise.creation_date.slice(5, 10).replace('T', ' '));
			}
		});

		lineData.labels = datesArray;
		lineData.datasets[0].data = repsArray;
		lineData.datasets[1].data = weightsArray;
		lineData.datasets[2].data = rpeArray;
	};
	const changeColor = (colorScheme: 'dark' | 'light') => {
		if (colorScheme === 'dark') {
			color = '#E4E4E7';
		} else color = '#212529';
	};
	const fetchData = async () => {
		await fetch(`/api/exercise_detail_sets/${exerciseType}`, { method: 'GET' })
			.then((response) => {
				response.json().then((response) => {
					data = response.data;
				});
			})
			.catch((error) => showNotification('fetch error' + error, 2000, notificationMessage));
	};
	if (browser) {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			colorScheme = event.matches ? 'dark' : 'light';
		});
	}
	$: extractData(data, exerciseType);
	$: changeColor(colorScheme);
	$: {
		if (modal) {
			modal.addEventListener('click', function (event) {
				var rect = modal.getBoundingClientRect();
				var isInDialog =
					rect.top <= event.clientY &&
					event.clientY <= rect.top + rect.height &&
					rect.left <= event.clientX &&
					event.clientX <= rect.left + rect.width;
				if (!isInDialog) {
					modal.close();
				}
			});
			fetchData();
		}
	}
	// 1. Write endpoint with where == exercisetype
</script>

<dialog bind:this={modal}>
	<div class="stats-container">
		<Line
			data={{ labels: lineData.labels, datasets: lineData.datasets.slice(1, 2) }}
			options={{
				responsive: true,
				color: color,
				scales: {
					y: {
						ticks: { color: color }
					},
					x: {
						ticks: { color: color }
					}
				}
			}}
		/>
		<Line
			data={{ labels: lineData.labels, datasets: lineData.datasets.slice(0, 1) }}
			options={{
				responsive: true,
				color: color,
				scales: {
					y: {
						ticks: { color: color }
					},
					x: {
						ticks: { color: color }
					}
				}
			}}
		/>
		<Line
			data={{ labels: lineData.labels, datasets: lineData.datasets.slice(2, 3) }}
			options={{
				responsive: true,
				color: color,
				scales: {
					y: {
						ticks: { color: color }
					},
					x: {
						ticks: { color: color }
					}
				}
			}}
		/>
	</div>
</dialog>

<style lang="postcss">
	.stats-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
	}
</style>
