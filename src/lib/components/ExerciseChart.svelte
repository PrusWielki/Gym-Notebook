<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js/auto';

	type ExerciseLog = {
		exercise_name: string;
		reps: number;
		weight: number;
		rpe: number;
		date: Date;
	};

	export let data: ExerciseLog[] = [];

	let canvas: HTMLCanvasElement;
	let chart: Chart;
	const isMobile = false;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (ctx) {
			chart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: data.map((d) => new Date(d.date).toLocaleDateString()),
					datasets: [
						{
							label: 'Weight (kg)',
							data: data.map((d) => d.weight),
							borderColor: 'rgb(75, 192, 192)',
							tension: 0.1,
							yAxisID: 'y'
						},
						{
							label: 'RPE',
							data: data.map((d) => d.rpe),
							borderColor: 'rgb(255, 99, 132)',
							tension: 0.1,
							yAxisID: 'y1'
						}
					]
				},
				options: {
					responsive: true,
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							type: 'linear',
							display: true,
							position: 'left',
							title: {
								display: true,
								text: 'Weight (kg)'
							}
						},
						y1: {
							type: 'linear',
							display: true,
							position: 'right',
							title: {
								display: true,
								text: 'RPE'
							},
							grid: {
								drawOnChartArea: false
							},
							min: 0,
							max: 10
						}
					}
				}
			});
		}
	});
</script>

<div class="w-full {isMobile ? 'h-[300px]' : 'h-[400px]'}">
	<canvas bind:this={canvas}></canvas>
</div>
