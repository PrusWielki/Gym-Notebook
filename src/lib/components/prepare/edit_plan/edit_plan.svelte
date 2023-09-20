<script lang="ts">
	import type { GetPlansResponse } from '../../../../routes/api/plans/[planId]/+server';

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
	// TODO
	// 1. Fetch plans list corresponding to user
	// 2. Collect new data
	// 3. Create endpoint to update a plan
	//
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
