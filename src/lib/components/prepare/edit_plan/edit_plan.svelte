<script lang="ts">
	import { browser } from '$app/environment';
	import type { GetPlansResponse } from '../../../../routes/api/plans/[planId]/+server';
	import TrainingDayInput from '$lib/components/training_day/training_day_input.svelte';

	export let exercises: Array<{ name: string; id: number }> | null;

	let plans: Array<{ id: number; name: string }> | null;

	let requestState: 'Loading' | 'Done';
	let chosenPlanId: number;
	let plan: GetPlansResponse;

	const handleSelectChange = async (event: Event) => {
		requestState = 'Loading';
		if (event.target)
			await fetch(`/api/plans/${(event.target as HTMLInputElement).value}`, { method: 'GET' }).then(
				async (response) => {
					await response.json().then((result) => (plan = result));
				}
			);
		chosenPlanId = +(event.target as HTMLInputElement).value;
		requestState = 'Done';
	};
	if (browser) {
		fetch(`/api/plans/author`, { method: 'GET' }).then(async (response) => {
			await response.json().then((result) => (plans = result.data.data));
		});
	}

	// TODO
	// 1. Fill this component to be able to add weeks etc
</script>

<div class="edit-plan-container">
	<h4>Choose Your plan:</h4>
	{#if plans}
		<select on:change={handleSelectChange}>
			<option value="" disabled selected>Plan</option>
			{#each plans as plan}
				<option value={plan.id}>{plan.name}</option>
			{/each}
		</select>
	{/if}
	{#if plan?.data}
		{#each plan.data[0].Weeks as week}
			<h4>Week {week.order}</h4>
			{#each week.Days as day}
				<TrainingDayInput bind:day {exercises} />
			{/each}
			<button
				on:click|preventDefault={() => {
					if (week?.Days)
						week.Days = [
							...week.Days,

							{
								name: '',
								notes: '',
								order: week.Days.length + 1,
								id: null,
								Exercise_Detail: [
									{
										order: 1,
										sets: null,
										target_reps: null,
										target_rpe: null,
										exercise_type_name: null,
										Exercise_Detail_Sets: null,
										id: null
									}
								]
							}
						];
				}}>Add a day</button
			>
		{/each}
	{/if}
</div>

<style lang="postcss">
	.edit-plan-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
		justify-content: center;
		align-items: center;
	}
	h4 {
		@media (--md-n-below) {
			font-size: var(--font-size-3);
		}
	}
	select {
		padding: var(--size-fluid-1) var(--size-fluid-2);
		font-size: var(--font-size-fluid-1);
		background-color: var(--button-2);
		color: var(--text-1);
		@media (--md-n-above) {
			max-width: 50%;
		}
	}
</style>
