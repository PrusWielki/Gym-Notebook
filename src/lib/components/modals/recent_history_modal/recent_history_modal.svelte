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
	import type { Exercises, ExtractedExercises } from '../../../../routes/(protected)/analyze/types';
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

	let extractedData: ExtractedExercises = [];
	let data: Exercises;
	const mapAndSortArray = (data: Exercises) => {
		data &&
			data.forEach((plan) => {
				plan.Weeks.forEach((week) => {
					week.Days.forEach((day) => {
						day.Exercise_Detail.forEach((exerciseDetail) => {
							exerciseDetail.Exercise_Detail_Sets.forEach((set) => {
								extractedData.push({
									...set,
									exercise_type_name: exerciseDetail.exercise_type_name
								});
							});
						});
					});
				});
			});
		extractedData &&
			extractedData.sort((a, b) => {
				return new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime();
			});
	};
	const extractData = (data: Exercises) => {
		mapAndSortArray(data);
		repsArray = [];
		weightsArray = [];
		datesArray = [];
		rpeArray = [];

		extractedData &&
			extractedData.forEach((exercise) => {
				if (exercise.creation_date) {
					repsArray.push(exercise.reps);
					weightsArray.push(exercise.weight);
					rpeArray.push(exercise.rpe);
					datesArray.push(exercise.creation_date.slice(5, 10).replace('T', ' '));
				}
			});
		lineData.labels = datesArray.slice(datesArray.length - 3, datesArray.length);
		lineData.datasets[0].data = repsArray.slice(repsArray.length - 3, repsArray.length);
		lineData.datasets[1].data = weightsArray.slice(weightsArray.length - 3, weightsArray.length);
		lineData.datasets[2].data = rpeArray.slice(rpeArray.length - 3, rpeArray.length);
	};
	const changeColor = (colorScheme: 'dark' | 'light') => {
		if (colorScheme === 'dark') {
			color = '#E4E4E7';
		} else color = '#212529';
	};
	const fetchData = async (exerciseType: string) => {
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
	$: extractData(data);
	$: changeColor(colorScheme);
	$: fetchData(exerciseType);
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
		}
	}
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
	<button
		class="close-button"
		on:click|preventDefault={() => {
			modal.close();
		}}>close</button
	>
</dialog>

<style lang="postcss">
	.stats-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
		width: 80vw;
		height: 80vh;
	}
	.close-button {
		background-color: var(--button-1);
		border-radius: var(--radius-1);
		padding: var(--size-fluid-1) var(--size-fluid-2);
		transition: background-color 0.5s var(--ease-3);
		font-size: var(--font-size-fluid-1);
		color: var(--text-1);
		font-weight: var(--font-weight-7);
		width: 50%;
		@media (--md-n-below) {
			width: 100%;
		}

		&:hover {
			background-color: var(--button-2);
		}
	}
</style>
