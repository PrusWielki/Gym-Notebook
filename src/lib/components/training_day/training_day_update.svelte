<script lang="ts">
	import notificationMessage from '$lib/store/notifications';
	import { showNotification } from '$lib/utils/show-notification';
	import { browser } from '$app/environment';
	export let day: App.TrainingDay;
	// export let targetReps: number;
	// export let targetRpe: number;
	// export let targetWeight: number;
	export let plansUsersId: string;
	export let numberOfWeeks: number;
	export let currentWeek: number;
	export let numberOfDays: number;

	let exerciseDetailSetsArray: Array<App.ExerciseDetailSet> = [];

	let repsArray: Array<number> = [];
	let rpeArray: Array<number> = [];
	let weightArray: Array<number> = [];
	if (browser) {
		if (window.localStorage.getItem('repsArray'))
			repsArray = JSON.parse(window.localStorage.getItem('repsArray')!);
		if (window.localStorage.getItem('rpeArray'))
			rpeArray = JSON.parse(window.localStorage.getItem('rpeArray')!);
		if (window.localStorage.getItem('weightArray'))
			weightArray = JSON.parse(window.localStorage.getItem('weightArray')!);
	}

	const onSave = async () => {
		day.Exercise_Detail.forEach((exercise, exerciseIndex) => {
			if (exercise.sets) {
				let arr = new Array(exercise.sets).fill(0);
				arr.forEach((_, setIndex) => {
					exerciseDetailSetsArray.push({
						reps: repsArray[day.Exercise_Detail.length * setIndex + exerciseIndex],
						set: setIndex + 1,
						rpe: rpeArray[day.Exercise_Detail.length * setIndex + exerciseIndex],
						weight: weightArray[day.Exercise_Detail.length * setIndex + exerciseIndex],
						target_reps: 12,
						target_rpe: 12,
						exercise_detail_id: day.Exercise_Detail[exerciseIndex].id!,
						plans_users_id: plansUsersId
					});
				});
			}
		});
		exerciseDetailSetsArray = exerciseDetailSetsArray.filter((set) => set.reps);
		if (exerciseDetailSetsArray.length <= 0) return;
		let newCurrentWeek = 0;
		let newCurrentDay = 0;

		if (day.order >= numberOfDays && currentWeek + 1 < numberOfWeeks) {
			newCurrentWeek = currentWeek + 1;
		} else newCurrentDay = day.order;
		await fetch('api/exercise_detail_sets', {
			method: 'POST',
			body: JSON.stringify({
				exerciseDetailSets: exerciseDetailSetsArray,
				plansUsersId,
				newCurrentDay,
				newCurrentWeek
			})
		}).then(async (response) => {
			if (response)
				await response.json().then((result) => {
					if (result.message) {
						showNotification('Error', 2000, notificationMessage);
					} else {
						showNotification('Day Saved', 2000, notificationMessage);
						window.localStorage.removeItem('repsArray');
						window.localStorage.removeItem('rpeArray');
						window.localStorage.removeItem('weightArray');
					}
				});
		});
	};
	$: window.localStorage.setItem('repsArray', JSON.stringify(repsArray));
	$: window.localStorage.setItem('rpeArray', JSON.stringify(rpeArray));
	$: window.localStorage.setItem('weightArray', JSON.stringify(weightArray));
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
				<div class="day-row-input">
					{#if index === 0}
						<h5>{exercise.exercise_type_name}</h5>
					{:else}
						<div />
					{/if}
					<h5>{(index + 1).toString()}</h5>
					<input
						bind:value={repsArray[day.Exercise_Detail.length * index + exerciseIndex]}
						placeholder={exercise.target_reps?.toString()}
					/>
					<input
						required={!!repsArray[day.Exercise_Detail.length * index + exerciseIndex]}
						bind:value={rpeArray[day.Exercise_Detail.length * index + exerciseIndex]}
						placeholder={exercise.target_rpe?.toString()}
					/>
					<input
						required={!!repsArray[day.Exercise_Detail.length * index + exerciseIndex]}
						bind:value={weightArray[day.Exercise_Detail.length * index + exerciseIndex]}
						placeholder=""
					/>
				</div>
			{/each}
		{/each}
	</div>
	<button on:click={onSave}>save</button>
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
</style>
