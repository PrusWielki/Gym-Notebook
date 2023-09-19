<script lang="ts">
	import type { PageData } from './$types';
	import TrainingDayUpdate from '$lib/components/training_day/training_day_update.svelte';
	import type { GetPlansResponse } from '../../api/plans/[planId]/+server';
	import { browser } from '$app/environment';
	import { error } from '@sveltejs/kit';

	export let data: PageData;
	let plan: GetPlansResponse;
	let chosenDay: App.TrainingDay;
	let chosenWeek: App.Week;

	let state: 'Loading' | 'Done' = 'Done';
	if (data?.plan && browser) {
		state = 'Loading';

		fetch(`api/plans/${data.plan.plan_id}`, { method: 'GET' }).then(async (response) => {
			await response.json().then((result) => {
				plan = result;
				if (plan.data) {
					chosenWeek = plan.data[0].Weeks[data?.plan.current_week];
					chosenDay = chosenWeek.Days[data?.plan.current_day];
				}
			});
			state = 'Done';
		});
	}
</script>

<div class="wrapper">
	<div class="container">
		<div class="train-container">
			{#if state === 'Loading'}
				<h4>Loading...</h4>
			{:else if plan?.data && data?.plan}
				<h4>{plan.data[0].name}</h4>
				<h5>Week {plan.data[0].Weeks[data?.plan.current_week].order}</h5>
				<select required bind:value={chosenWeek}>
					<option value="" disabled>Week</option>
					{#each plan.data[0].Weeks as week}
						<option value={week}>Week {week.order}</option>
					{/each}
				</select>
				{#if chosenWeek}
					<select required bind:value={chosenDay}>
						<option value="" disabled selected>Day</option>
						{#each chosenWeek.Days as day, index}
							<option value={day}>{day.name}</option>
						{/each}
					</select>
				{/if}
				{#if chosenDay}
					<form>
						<TrainingDayUpdate
							day={chosenDay}
							plansUsersId={data.plan.id}
							currentWeek={data.plan.current_week}
							numberOfDays={plan.data[0].Weeks[data?.plan.current_week].Days.length}
							numberOfWeeks={plan.data[0].Weeks.length}
						/>
					</form>
				{/if}
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
		gap: var(--size-fluid-2);
	}
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: var(--size-fluid-4);
		padding-bottom: var(--size-10);
	}

	h4 {
		font-size: var(--font-size-fluid-3);
		text-align: center;
		background: var(--gradient-3);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	h5 {
		font-size: var(--font-size-fluid-2);
	}
	select {
		appearance: none;
		text-align: center;
		padding: var(--size-1);
		width: var(--size-11);
		font-size: var(--font-size-1);
		width: var(--size-fluid-8);
		@media (--md-n-below) {
			font-size: var(--font-size-0);
		}
	}
</style>
