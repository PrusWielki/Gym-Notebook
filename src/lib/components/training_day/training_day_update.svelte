<script lang="ts">
	export let day: App.TrainingDay;
</script>

{#if day.Exercise_Detail.length > 0}
	<div class="day-container">
		<h4>{day.name}</h4>
		<div class="day-label-row">
			<h5>Exercise</h5>
			<h5>Sets</h5>
			<h5>Reps</h5>
			<h5>RPE</h5>
		</div>
		{#each day.Exercise_Detail as exercise, exercise_index}
			<div class="day-row-input">
				<h5>{exercise.exercise_type_name}</h5>

				<input required bind:value={exercise.sets} placeholder="Sets" />
				<input required bind:value={exercise.target_reps} placeholder="Reps" />
				<input required bind:value={exercise.target_rpe} placeholder="RPE" />
			</div>
		{/each}
	</div>
{/if}

<style lang="postcss">
	.day-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: var(--border-size-2) var(--accent) solid;
		padding: var(--size-fluid-3) var(--size-fluid-2);
		border-radius: var(--radius-2);
		box-shadow: var(--shadow-1);
		gap: var(--size-fluid-2);
		max-width: var(--size-md);
		width: 100%;
		h5 {
			font-size: var(--font-size-fluid-0);
		}
	}
	.day-label-row {
		display: grid;
		grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr;
		width: 100%;
		text-align: center;
		gap: var(--size-2);
	}
	.day-row-input {
		display: grid;
		grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr;
		width: 100%;
		text-align: center;
		gap: var(--size-2);
		align-items: center;

		input {
			width: var(--size-11);
			font-size: var(--font-size-1);
			text-align: center;
			width: 100%;
			@media (--md-n-below) {
				font-size: var(--font-size-0);
			}
		}
	}
	select {
		appearance: none;
		text-align: center;
		padding: var(--size-1);
		width: var(--size-11);
		font-size: var(--font-size-1);
		width: 100%;
		@media (--md-n-below) {
			font-size: var(--font-size-0);
		}
	}
	.input-day-name {
		width: 50%;
		justify-self: center;
		align-self: center;
		text-align: center;
	}
</style>
