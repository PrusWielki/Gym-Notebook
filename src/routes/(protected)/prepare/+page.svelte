<script lang="ts">
	import TrainingDayInput from '$lib/components/training_day/training_day_input.svelte';
	import TrainingDayShow from '$lib/components/training_day/training_day_show.svelte';

	import type { PageData } from './$types';
	import type { GetPlansResponse } from '../../api/plans/[planId]/+server';
	import notificationMessage from '$lib/store/notifications';
	import { showNotification } from '$lib/utils/show-notification';

	export let data: PageData;
	let premadePlan: GetPlansResponse;

	const handleSelectChange = async (event: Event) => {
		requestState = 'Loading';
		if (event.target)
			await fetch(`/api/plans/${(event.target as HTMLInputElement).value}`, { method: 'GET' }).then(
				async (response) => {
					await response.json().then((result) => (premadePlan = result));
				}
			);
		requestState = 'Done';
		showNotification('Program chosen', 2000, notificationMessage);
	};

	let planName: string;
	let periodization: string;
	let requestState: 'Saving' | 'Loading' | 'Done';
	let weeks: Array<App.Week> = [
		{
			order: 1,
			Days: [
				{
					name: '',
					notes: '',
					Exercise_Detail: [
						{
							sets: null,
							target_reps: null,
							target_rpe: null,
							exercise_type_name: null,
							Exercise_Detail_Sets: null
						}
					]
				}
			]
		}
	];
	$: {
		weeks.forEach((week) => {
			if (week?.Days) week.Days = week?.Days.filter((day) => day.Exercise_Detail.length > 0);
		});
		weeks = weeks.filter((week) => {
			if (week?.Days) return week?.Days.length > 0;
		});
	}
</script>

<div class="wrapper">
	<div class="container">
		<div class="prepare-container">
			<h2>Prepare Your training plan</h2>
			{#if data.plans.data}
				<h4>Choose an exisitng plan:</h4>
				<select on:change={handleSelectChange}>
					<option value="" disabled selected>Plan</option>
					{#each data.plans.data as plan}
						<option value={plan.id}>{plan.name}</option>
					{/each}
				</select>
			{/if}
			{#if requestState === 'Loading'}
				<h3 class="loading">Loading...</h3>
			{:else if premadePlan?.data}
				{#each premadePlan.data[0].Weeks as week}
					<h4>Week - {week.order}</h4>
					{#each week.Days as day}
						<TrainingDayShow {day} />
					{/each}
				{/each}
			{/if}
			<form>
				<h4>Or create a new plan:</h4>
				<input required bind:value={planName} type="text" placeholder="Plan Name" />

				{#if data.periodizations.data && weeks.length === 1}
					<h4>Periodization</h4>
					<select bind:value={periodization}>
						<option value="" disabled selected>Periodization</option>
						{#each data.periodizations.data as periodization}
							<option value={periodization.type}>{periodization.type}</option>
						{/each}
					</select>
				{/if}
				{#each weeks as week}
					{#if week?.Days}
						<h4 class="week-input">
							Week <input
								placeholder={week.order.toString()}
								bind:value={week.order}
								on:blur={() => {
									weeks = weeks.sort((a, b) => {
										if (a && b && a.order > b.order) return 1;
										else return -1;
									});
								}}
							/>
						</h4>
						{#each week.Days as day}
							<TrainingDayInput exercises={data.exercises.data} bind:day />
						{/each}
						<button
							on:click|preventDefault={() => {
								if (week?.Days)
									week.Days = [
										...week.Days,

										{
											name: '',
											notes: '',
											Exercise_Detail: [
												{
													sets: null,
													target_reps: null,
													target_rpe: null,
													exercise_type_name: null,
													Exercise_Detail_Sets: null
												}
											]
										}
									];
							}}>Add a day</button
						>
					{/if}
				{/each}
				{#if periodization === 'None' || periodization === ''}
					<button
						on:click|preventDefault={() => {
							if (weeks)
								weeks = [
									...weeks,
									{
										order: weeks.length + 1,
										Days: [
											{
												name: '',
												notes: '',
												Exercise_Detail: [
													{
														sets: null,
														target_reps: null,
														target_rpe: null,
														exercise_type_name: null,
														Exercise_Detail_Sets: null
													}
												]
											}
										]
									}
								];
						}}>Add a week</button
					>
				{/if}
				<button
					on:click={async () => {
						let chosenPeriodization = periodization ? periodization : 'None';
						let isCustom = false;
						if (weeks.length > 1) {
							isCustom = true;
							chosenPeriodization = 'None';
						}
						requestState = 'Saving';
						await fetch('/api/plans', {
							method: 'POST',
							body: JSON.stringify({
								weeks,
								planName: planName,
								custom: isCustom,
								periodization: chosenPeriodization
							})
						})
							.then((response) => {
								if (response.ok) {
									return response.json();
								}
								throw new Error();
							})

							.then(async () => {
								await fetch('/api/plans', {
									method: 'GET'
								}).then(async (response) => {
									await response.json().then((response) => (data.plans = response.data));
									showNotification('Program chosen', 2000, notificationMessage);
								});
							})
							.catch(() => showNotification('Error occured', 2000, notificationMessage));

						requestState = 'Done';
					}}
					class="accent"
					>{#if requestState === 'Saving'}
						Saving...
					{:else}
						Save the plan
					{/if}</button
				>
			</form>
		</div>
	</div>
</div>

<style lang="postcss">
	.week-input {
		display: flex;
		justify-content: center;
		gap: var(--size-fluid-1);
		input {
			width: 20%;
		}
	}
	.prepare-container {
		padding: var(--size-fluid-6) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		gap: var(--size-4);
		h2 {
			background: var(--gradient-3);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			@media (--md-n-below) {
				font-size: var(--font-size-4);
			}
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
		input {
			font-size: var(--font-size-fluid-1);
			text-align: center;
			&::placeholder {
				color: var(--text-1);
			}
		}
		form {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			gap: var(--size-4);
		}
	}

	button {
		background-color: var(--button-1);
		border-radius: var(--radius-1);
		padding: var(--size-fluid-1) var(--size-fluid-2);
		transition: background-color 0.5s var(--ease-3);
		font-size: var(--font-size-fluid-1);
		color: var(--text-1);
		font-weight: var(--font-weight-7);

		&.accent {
			background-color: var(--accent);
		}
		&:hover {
			background-color: var(--button-2);
		}
	}
	.loading {
		font-size: var(--font-size-fluid-2);
		padding: 0 var(--size-fluid-6);
	}
</style>
