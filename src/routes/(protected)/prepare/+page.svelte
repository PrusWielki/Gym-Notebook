<script lang="ts">
	import TrainingDayInput from '$lib/components/training_day/training_day_input.svelte';
	let planName: String;
	let days: Array<
		Array<{
			exercise_type_name: string | null;
			sets: number | null;
			target_reps: string | null;
			target_rpe: number | null;
		}>
	> = [[{ exercise_type_name: '', sets: null, target_reps: '', target_rpe: null }]];
	$: days = days.filter((day) => day.length > 0);
</script>

<div class="wrapper">
	<div class="container">
		<div class="prepare-container">
			<h2>Prepare Your training plan</h2>
			<h4>Create a new plan:</h4>
			<input bind:value={planName} type="text" placeholder="Plan Name" />
			{#each days as day}
				<TrainingDayInput bind:day />
			{/each}

			<button
				on:click={() => {
					if (days.length === 7) alert('A week has only 7 days :)');
					else
						days = [
							...days,
							[{ exercise_type_name: '', sets: null, target_reps: '', target_rpe: null }]
						];
				}}>Add a day</button
			>
			<button class="accent">Save the plan</button>
			<h4>Or choose an exisitng plan:</h4>
			<select><option>option 1</option><option>option 1</option><option>option 1</option></select>
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
			padding: var(--size-fluid-2);
			font-size: var(--font-size-fluid-1);
			background-color: var(--button-2);
			color: var(--text-1);
		}
		input {
			font-size: var(--font-size-fluid-1);
			&::placeholder {
				color: var(--text-1);
			}
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
