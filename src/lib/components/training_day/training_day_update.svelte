<script lang="ts">
	export let day: App.TrainingDay;
	// export let targetReps: number;
	// export let targetRpe: number;
	// export let targetWeight: number;
	export let planUsersId: string;
	const exerciseDetailSetsArray: Array<App.ExerciseDetailSet> = [];

	const repsArray: Array<Array<number>> = [[]];
	const rpeArray: Array<Array<number>> = [[]];
	const weightArray: Array<Array<number>> = [[]];

	const onSave = async () => {
		repsArray.forEach((reps, exerciseIndex) => {
			reps.forEach((rep, setIndex) => {
				exerciseDetailSetsArray.push({
					reps: rep,
					set: setIndex + 1,
					rpe: rpeArray[exerciseIndex][setIndex],
					weight: weightArray[exerciseIndex][setIndex],
					target_reps: 12,
					target_rpe: 12,
					exercise_detail_id: day.Exercise_Detail[exerciseIndex].id!,
					plans_users_id: planUsersId
				});
			});
		});
		await fetch('api/exercise_detail_sets', {
			method: 'POST',
			body: JSON.stringify({ exerciseDetailSets: exerciseDetailSetsArray })
		});
	};
</script>

{#if day.Exercise_Detail.length > 0}
	<div class="day-container">
		<h4>{day.name}</h4>
		<div class="day-label-row">
			<h5>Exercise</h5>
			<h5>Sets</h5>
			<h5>Reps</h5>
			<h5>RPE</h5>
			<h5>Weight</h5>
		</div>
		{#each day.Exercise_Detail as exercise, exerciseIndex}
			{#each Array(exercise.sets) as _, index}
				<script lang="ts">
				</script>
				<div class="day-row-input">
					{#if index === 0}
						<h5>{exercise.exercise_type_name}</h5>
					{:else}
						<!-- svelte-ignore a11y-missing-content -->
						<h5 />
					{/if}
					<h5>{(index + 1).toString()}</h5>
					<input
						required
						bind:value={repsArray[exerciseIndex][index]}
						placeholder={exercise.target_reps?.toString()}
					/>
					<input
						required
						bind:value={rpeArray[exerciseIndex][index]}
						placeholder={exercise.target_rpe?.toString()}
					/>
					<input required bind:value={weightArray[exerciseIndex][index]} placeholder="" />
				</div>
			{/each}
		{/each}
	</div>
	<button>save</button>
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
	button {
		background-color: var(--button-1);
		border-radius: var(--radius-1);
		padding: var(--size-fluid-1) var(--size-fluid-2);
		transition: background-color 0.5s var(--ease-3);
		font-size: var(--font-size-fluid-1);
		color: var(--text-1);
		font-weight: var(--font-weight-7);
		width: 50%;
		@media (--md-n-below) {
			width: 100%;
		}

		&.accent {
			background-color: var(--accent);
		}
		&:hover {
			background-color: var(--button-2);
		}
	}
	.day-label-row {
		display: grid;
		grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.5fr;
		width: 100%;
		text-align: center;
		gap: var(--size-2);
	}
	.day-row-input {
		display: grid;
		grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.5fr;
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
