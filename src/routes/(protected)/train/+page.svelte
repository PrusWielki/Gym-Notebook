<script lang="ts">
	import type { PageData } from './$types';
	import TrainingDayUpdate from '$lib/components/training_day/training_day_update.svelte';
	import { browser } from '$app/environment';

	export let data: PageData;
	let chosenDay: App.TrainingDay;
	let chosenWeek: App.Week;

	let state: 'loading' | 'done' = 'loading';

	if (data.planData && data?.planName && browser) {
		chosenWeek = data.planData[0].Weeks[data?.planName[0].current_week];
		if (chosenWeek?.Days) chosenDay = chosenWeek.Days[data?.planName[0].current_day];
		state = 'done';
	}
</script>

<div class="wrapper">
	<div class="container">
		<div class="train-container">
			{#if data.planData && data?.planName && state == 'done'}
				<h4>{data.planData[0].name}</h4>
				<div class="select-container">
					<select required bind:value={chosenWeek}>
						<option value="" disabled>Week</option>
						{#each data.planData[0].Weeks as week}
							<option value={week}>Week {week.order}</option>
						{/each}
					</select>
					{#if chosenWeek}
						<select required bind:value={chosenDay}>
							<option value="" disabled selected>Day</option>
							{#if chosenWeek?.Days}
								{#each chosenWeek.Days as day, index}
									<option value={day}>{day.name}</option>
								{/each}
							{/if}
						</select>
					{/if}
				</div>
				{#if chosenDay && chosenWeek}
					<form>
						<TrainingDayUpdate
							day={chosenDay}
							plansUsersId={data?.planName[0].plan_id}
							currentWeek={chosenWeek.order - 1}
							numberOfDays={data.planData[0].Weeks[data?.planName[0].current_week]?.Days?.length}
							numberOfWeeks={data.planData[0].Weeks.length}
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
	.select-container {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: var(--size-3);
		@media (--md-n-above) {
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
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
		font-size: var(--font-size-4);
		text-align: center;
		background: var(--gradient-3);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	select {
		appearance: none;
		text-align: center;
		padding: var(--size-1);
		width: var(--size-12);
		font-size: var(--font-size-1);
		background-color: var(--surface-2);
		text-align-last: center;
		text-overflow: ellipsis;
		@media (--md-n-above) {
			width: var(--size-sm);
		}
	}
</style>
