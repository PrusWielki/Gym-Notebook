<script lang="ts">
	import type { PageData } from './$types';
	import TrainingDayUpdate from '$lib/components/training_day/training_day_update.svelte';
	import type { GetPlansResponse } from '../../api/plans/[planId]/+server';
	import { browser } from '$app/environment';

	export let data: PageData;
	let plan: GetPlansResponse;
	let state: 'Loading' | 'Done' = 'Done';
	if (data?.plan && browser) {
		state = 'Loading';

		fetch(`api/plans/${data.plan[0].plan_id}`, { method: 'GET' }).then(async (response) => {
			await response.json().then((result) => (plan = result));
			state = 'Done';
		});
	}
</script>

<div class="wrapper">
	<div class="container">
		<div class="train-container">
			{#if state === 'Loading'}
				<h4>Loading...</h4>
			{:else if plan?.data}
				{#each plan.data[0].Weeks[0].Days as day}
					<TrainingDayUpdate {day} />
				{/each}

				<button>save</button>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.train-container {
		margin-top: var(--size-fluid-6);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: var(--size-fluid-4);
	}
	button {
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

		&.accent {
			background-color: var(--accent);
		}
		&:hover {
			background-color: var(--button-2);
		}
	}
	h4 {
		margin-top: var(--size-fluid-6);
		text-align: center;
		background: var(--gradient-3);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
