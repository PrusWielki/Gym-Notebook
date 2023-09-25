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
