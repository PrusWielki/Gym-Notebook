<script lang="ts">
	export let day: App.TrainingDay;
</script>

{#if day.Exercise_Detail.length > 0}
	<div class="day-container">
		<h5>{day.name}</h5>
		<div class="day-label-row">
			<h5>Exercise</h5>
			<h5>Sets</h5>
			<h5>Reps</h5>
			<h5>RPE</h5>
			<h5>Weight</h5>
		</div>
		{#each day.Exercise_Detail as exercise}
			{#if exercise.Exercise_Detail_Sets}
				{#each exercise.Exercise_Detail_Sets as set}
					<div class="day-row">
						<h5>{exercise.exercise_type_name}</h5>
						<h5>{set.set}</h5>
						<h5>{set.target_reps}</h5>

						<h5>{set.target_rpe}</h5>
						<h5>{set.weight}</h5>
					</div>
				{/each}
			{/if}
		{/each}
	</div>
{/if}

<style lang="postcss">
	.day-container {
		display: flex;
		flex-direction: column;
		border: var(--border-size-2) var(--accent) solid;
		padding: var(--size-fluid-3) var(--size-fluid-2);
		border-radius: var(--radius-2);
		box-shadow: var(--shadow-1);
		gap: var(--size-fluid-2);
		max-width: var(--size-md);
		width: var(--size-md);
		h5 {
			font-size: var(--font-size-fluid-1);
			align-self: center;
		}
	}
	.day-label-row {
		display: grid;
		grid-template-columns: 1fr 0.4fr 0.4fr 0.4fr 0.4fr;
		width: 100%;
		text-align: center;
	}
	.day-row {
		display: grid;
		grid-template-columns: 1fr 0.4fr 0.4fr 0.4fr 0.4fr;
		width: 100%;
		text-align: center;

		h5 {
			vertical-align: center;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: var(--font-weight-4);
		}
	}
</style>
