<script lang="ts">
	import { browser } from '$app/environment';
	import TrainingDayInput from '$lib/components/training_day/training_day_input.svelte';
	import type { UpdatePlan } from './types';
	import { showNotification } from '$lib/utils/show-notification';
	import notificationMessage from '$lib/store/notifications';
	export let exercises: Array<{ name: string; id: number }> | null;
	export let periodizations: Array<{ type: string }> | null;

	let plans: Array<{ id: number; name: string }> | null;
	let periodization: string;
	let requestState: 'Saving' | 'Loading' | 'Done';
	let chosenPlanId: number;
	let plan: UpdatePlan;
	let originalPlan: UpdatePlan;
	let dialog: HTMLDialogElement;
	let deleteInput = '';
	const allowDelete = false;
	let toRemove: Array<{ type: 'Day' | 'Week' | 'Exercise_Detail'; id: number }> | null = [];

	const handleSelectChange = async (event: Event) => {
		requestState = 'Loading';
		if (event.target)
			await fetch(`/api/plans/${(event.target as HTMLInputElement).value}`, { method: 'GET' }).then(
				async (response) => {
					await response.json().then((result) => {
						plan = result;
						originalPlan = JSON.parse(JSON.stringify(result));
					});
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
	$: {
		plan?.data &&
			plan.data[0].Weeks.forEach((week) => {
				if (week?.Days)
					week.Days = week?.Days.filter((day) => {
						if (day.Exercise_Detail.length <= 0 && day.id) {
							toRemove?.push({ type: 'Day', id: day.id });
							return false;
						} else return true;
					});
			});
		if (plan?.data)
			plan.data[0].Weeks = plan.data[0].Weeks.filter((week) => {
				if (week?.Days) {
					if (week?.Days.length <= 0 && week.id) {
						toRemove?.push({ type: 'Week', id: week.id });
						return false;
					} else return true;
				}
			});
	}

	// TODO
	// 1. Add deleting. Maybe compare old and new plan filter the old plan and delete each element.
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
		<form>
			{#if periodizations && plan.data[0].Weeks.length === 1}
				<h4>Periodization</h4>
				<select bind:value={periodization}>
					<option value="" disabled selected>Periodization</option>
					{#each periodizations as periodization}
						<option value={periodization.type}>{periodization.type}</option>
					{/each}
				</select>
			{/if}
			{#each plan.data[0].Weeks as week}
				<h4>Week {week.order}</h4>
				{#each week.Days as day}
					<TrainingDayInput bind:day {exercises} bind:toRemove />
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
			{#if periodization === 'None' || periodization === ''}
				<button
					on:click|preventDefault={() => {
						if (plan?.data && plan.data[0].Weeks)
							plan.data[0].Weeks = [
								...plan.data[0].Weeks,
								{
									order: plan.data[0].Weeks.length + 1,
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
					if (plan.data) {
						let chosenPeriodization = periodization ? periodization : 'None';
						let isCustom = false;
						if (plan.data && plan.data[0].Weeks.length > 1) {
							isCustom = true;
							chosenPeriodization = 'None';
						}
						requestState = 'Saving';
						await fetch('/api/plans/author', {
							method: 'POST',
							body: JSON.stringify({
								weeks: plan.data[0].Weeks,
								planName: plan.data[0].name,
								custom: isCustom,
								periodization: chosenPeriodization,
								planId: plan.data[0].id,
								toRemove
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
					}
				}}
				class="accent"
				>{#if requestState === 'Saving'}
					Saving...
				{:else}
					Save the plan
				{/if}</button
			>
			{#if allowDelete}
				<button
					class="delete-button"
					on:click={() => {
						dialog.showModal();
					}}>Delete</button
				>
				<dialog bind:this={dialog}>
					<div class="modal-container">
						<h4>Type Delete below</h4>
						<input bind:value={deleteInput} />
						<button class="delete-button" disabled={deleteInput !== 'Delete'}> Delete </button>
						<button
							class="accent"
							on:click={() => {
								dialog.close();
							}}
						>
							Cancel
						</button>
					</div>
				</dialog>
			{/if}
		</form>
	{/if}
</div>

<style lang="postcss">
	.delete-button {
		background-color: var(--red-8);
		&:disabled {
			background-color: var(--button-1);
		}
	}
	dialog {
		@media (--md-n-below) {
			top: 10%;
			margin-top: 0;
		}
	}
	.modal-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
		padding: var(--size-2);
	}
	h4 {
		@media (--md-n-below) {
			font-size: var(--font-size-3);
		}
	}
	.edit-plan-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
		align-items: center;
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
