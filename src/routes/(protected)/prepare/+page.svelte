<script lang="ts">
	import TrainingDayInput from '$lib/components/training_day/training_day_input.svelte';
	import TrainingDayShow from '$lib/components/training_day/training_day_show.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const handleSelectChange = async (event: Event) => {
		if (event.target)
			await fetch(`/api/plans/${(event.target as HTMLInputElement).value}`, { method: 'GET' }).then(
				async (response) => {
					let result = await response.json();
					console.log(result);
				}
			);
	};

	let planName: string;
	let saving: boolean = false;
	let days: App.TrainingDays = [
		[{ exercise_type_name: '', sets: null, target_reps: '', target_rpe: null }]
	];

	$: days = days.filter((day) => day.length > 0);
</script>

<div class="wrapper">
	<div class="container">
		<div class="prepare-container">
			<form>
				<h2>Prepare Your training plan</h2>
				<h4>Create a new plan:</h4>
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
								[{ exercise_type_name: '', sets: null, target_reps: '', target_rpe: null }]
							];
					}}>Add a day</button
				>
				<button
					on:click={async () => {
						saving = true;
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

						saving = false;
					}}
					class="accent"
					>{#if saving}
						Saving...
					{:else}
						Save the plan
					{/if}</button
				>
				{#if data.plans.data}
					<h4>Or choose an exisitng plan:</h4>
					<select on:change={handleSelectChange}>
						<option value="" disabled selected>Plan</option>
						{#each data.plans.data as plan}
							<option value={plan.id}>{plan.name}</option>
						{/each}
					</select>
				{/if}
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
