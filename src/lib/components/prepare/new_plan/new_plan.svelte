<script lang="ts">
	import { showNotification } from '$lib/utils/show-notification';
	import notificationMessage from '$lib/store/notifications';
	import TrainingDayInput from '$lib/components/training_day/training_day_input.svelte';

	export let periodizations: Array<{ type: string }> | null;
	export let exercises: Array<{ name: string; id: number }> | null;

	let periodization: string;
	let requestState: 'Saving' | 'Loading' | 'Done';
	let planName: string;

	let weeks: Array<App.Week> = [
		{
			order: 1,
			id: null,
			Days: [
				{
					name: '',
					notes: '',
					order: 1,
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

<form>
	<h4>Or create a new plan:</h4>
	<input required bind:value={planName} type="text" placeholder="Plan Name" />

	{#if periodizations && weeks.length === 1}
		<h4>Periodization</h4>
		<select bind:value={periodization}>
			<option value="" disabled selected>Periodization</option>
			{#each periodizations as periodization}
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
				<TrainingDayInput {exercises} bind:day />
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
							id: null,
							Days: [
								{
									order: 1,
									name: '',
									notes: '',
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
						showNotification('Plan Saved', 2000, notificationMessage);
						return response.json();
					}
					throw new Error();
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

<style lang="postcss">
	.week-input {
		display: flex;
		justify-content: center;
		gap: var(--size-fluid-1);
		input {
			width: 20%;
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
		background-color: var(--surface-2);
		color: var(--text-1);

		text-align-last: center;
		text-overflow: ellipsis;

		width: var(--size-xxs);
		@media (--md-n-above) {
			width: var(--size-sm);
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
