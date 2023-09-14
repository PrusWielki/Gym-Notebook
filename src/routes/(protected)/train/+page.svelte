<script lang="ts">
	import type { PageData } from './$types';
	import TrainingDayUpdate from '$lib/components/training_day/training_day_update.svelte';
	import type { GetPlansResponse } from '../../api/plans/[planId]/+server';
	import { browser } from '$app/environment';

	export let data: PageData;
	let plan: GetPlansResponse;
	let plansUsersId: string;
	let state: 'Loading' | 'Done' = 'Done';
	if (data?.plan && browser) {
		state = 'Loading';

		fetch(`api/plans/${data.plan[0].plan_id}`, { method: 'GET' }).then(async (response) => {
			await response.json().then((result) => (plan = result));
		});
		fetch(`api/plansUsers/${data.plan[0].plan_id}`, { method: 'GET' }).then(async (response) => {
			await response.json().then((result) => (plansUsersId = result.data[0].id));
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
				<form>
					{#each plan.data[0].Weeks[data?.plan[0].current_week].Days as day}
						<TrainingDayUpdate {day} planUsersId={plansUsersId} />
					{/each}
				</form>
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
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: var(--size-fluid-4);
	}

	h4 {
		text-align: center;
		background: var(--gradient-3);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
