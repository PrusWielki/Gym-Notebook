<script lang="ts">
	import TrainingDayInput from '$lib/components/training_day/training_day_input.svelte';
	import TrainingDayShow from '$lib/components/training_day/training_day_show.svelte';

	import type { PageData } from './$types';
	import notificationMessage from '$lib/store/notifications';
	import { showNotification } from '$lib/utils/show-notification';

	export let data: PageData;
	let premadePlan: Array<App.TrainingDays>;

	const handleSelectChange = async (event: Event) => {
		requestState = 'Loading';
		if (event.target)
			await fetch(`/api/plans/${(event.target as HTMLInputElement).value}`, { method: 'GET' }).then(
				async (response) => {
					await response.json().then((result) => (premadePlan = result.data));
					console.log(premadePlan);
				}
			);
		requestState = 'Done';
		showNotification('Program chosen', 2000, notificationMessage);
	};

	let planName: string;
	let requestState: 'Saving' | 'Loading' | 'Done';
	let days: App.TrainingDays = [
		{
			name: '',
			Exercise_Detail: [{ exercise_type_name: '', sets: null, target_reps: '', target_rpe: null }]
		}
	];

	$: days = days.filter((day) => day.Exercise_Detail.length > 0);
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
				<h3>Loading...</h3>
			{/if}
			{#if premadePlan}
				{#each premadePlan as day}
					<TrainingDayShow day={day[0]} />
				{/each}
			{/if}
			<form>
				<h4>Or create a new plan:</h4>
				<input required bind:value={planName} type="text" placeholder="Plan Name" />
				{#each days as day}
					<TrainingDayInput exercises={data.exercises.data} bind:day />
				{/each}

				<button
					on:click|preventDefault={() => {
						if (days.length === 7) alert('A week has only 7 days :)');
						else
							days = [
								...days,
								{
									name: '',
									Exercise_Detail: [
										{ exercise_type_name: '', sets: null, target_reps: '', target_rpe: null }
									]
								}
							];
					}}>Add a day</button
				>
				<button
					on:click={async () => {
						requestState = 'Saving';
						await fetch('/api/plans', {
							method: 'POST',
							body: JSON.stringify({ days: days, planName: planName })
						}).finally(async () => {
							await fetch('/api/plans', {
								method: 'GET'
							}).then(
								async (response) =>
									await response.json().then((response) => (data.plans = response.data))
							);
						});

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
</style>
