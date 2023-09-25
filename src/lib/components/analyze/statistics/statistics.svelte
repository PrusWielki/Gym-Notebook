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
	const repsArray: Array<number> = [];
	const weightsArray: Array<number> = [];
	const datesArray: Array<string> = [];

	const extractData = (data: GetPlansResponse['data']) => {
		data?.forEach((plan) => {
			plan.Weeks.forEach((week) => {
				week.Days.forEach((day) => {
					day.Exercise_Detail.forEach((exercise) => {
						exercise.Exercise_Detail_Sets.forEach((set) => {
							repsArray.push(set.reps);
							weightsArray.push(set.weight);
							datesArray.push(set.creation_date.slice(0, 16).replace('T', ' '));
						});
					});
				});
			});
		});
		lineData.labels = datesArray;
		lineData.datasets[0].data = repsArray;
		lineData.datasets[1].data = weightsArray;
	};
	$: extractData(allData);
</script>

<Line
	data={lineData}
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

<style lang="postcss">
	.line-container {
		padding: var(--size-fluid-2) 0;
		height: 100%;
		width: 100%;
	}
</style>
