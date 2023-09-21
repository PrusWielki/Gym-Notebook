<script lang="ts">
	import TrainingDayShow from '$lib/components/training_day/training_day_show.svelte';
	import type { GetPlansResponse } from '../../../../routes/api/plans/[planId]/+server';
	import { showNotification } from '$lib/utils/show-notification';
	import notificationMessage from '$lib/store/notifications';
	import type { PageData } from '../../../../routes/$types';
	export let plans: Array<{ id: number; name: string }> | null;

	let requestState: 'Loading' | 'Done' | 'Saving' = 'Done';
	let chosenPlanId: number;
	let premadePlan: GetPlansResponse;

	const handleSelectChange = async (event: Event) => {
		requestState = 'Loading';
		if (event.target)
			await fetch(`/api/plans/${(event.target as HTMLInputElement).value}`, { method: 'GET' }).then(
				async (response) => {
					await response.json().then((result) => (premadePlan = result));
				}
			);
		chosenPlanId = +(event.target as HTMLInputElement).value;
		requestState = 'Done';
	};
</script>

{#if plans}
	<h4>Choose an exisitng plan:</h4>
	<select on:change={handleSelectChange}>
		<option value="" disabled selected>Plan</option>
		{#each plans as plan}
			<option value={plan.id}>{plan.name}</option>
		{/each}
	</select>
{/if}
{#if requestState === 'Loading'}
	<h3 class="loading">Loading...</h3>
{:else if premadePlan?.data}
	{#each premadePlan.data[0].Weeks as week}
		<h4>Week {week.order}</h4>
		{#each week.Days as day}
			<TrainingDayShow {day} />
		{/each}
	{/each}
	<button
		class="accent"
		on:click={async () => {
			await fetch(`/api/plansUsers/${chosenPlanId}`, { method: 'POST' })
				.then(() => {
					showNotification('Program chosen', 2000, notificationMessage);
				})
				.catch(() => {
					showNotification('Error when choosing a program!', 2000, notificationMessage);
				});
		}}
		>{#if requestState === 'Saving'}
			Saving...
		{:else}
			Save the plan
		{/if}</button
	>
{/if}
