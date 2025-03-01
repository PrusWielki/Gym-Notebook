<script lang="ts">
	import ExerciseChartModal from './ExerciseChartModal.svelte';
	import { finishedExercises } from '$lib/store/finished-exercises';

	export let exercises: Array<{
		exercise_name: string;
		sets: string | number;
		reps: string | number;
		rpe: string | number;
		weight: string | number;
		notes?: string;
	}>;
	export let isEditable = false;
	export let exerciseData: Record<
		string,
		Array<{ sets: number; reps: number; rpe: number; weight: number }>
	> = {};

	export let planId: string = '';
	export let currentWeek: number = 0;
	export let currentDay: number = 0;

	let selectedExercise: string | null = null;
	let showModal = false;

	function handleExerciseClick(exerciseName: string) {
		selectedExercise = exerciseName;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedExercise = null;
	}

	function updateExerciseData(
		exerciseName: string,
		setIndex: number,
		field: 'sets' | 'reps' | 'rpe' | 'weight',
		value: number
	) {
		if (!exerciseData[exerciseName]) {
			const exercise = exercises.find((e) => e.exercise_name === exerciseName);
			const numSets = exercise ? +exercise.sets : 0;
			exerciseData[exerciseName] = Array(numSets)
				.fill(null)
				.map(() => ({ sets: 1, reps: 0, rpe: 0, weight: 0 }));
		}

		const currentSet = exerciseData[exerciseName][setIndex];
		if (currentSet) {
			exerciseData[exerciseName][setIndex] = {
				...currentSet,
				[field]: value
			};
			exerciseData = exerciseData;
		}
	}

	function isExerciseFinished(exerciseName: string): boolean {
		return $finishedExercises.some(
			(e) =>
				e.planId === planId &&
				e.week === currentWeek &&
				e.day === currentDay &&
				e.exerciseName === exerciseName
		);
	}

	function toggleExerciseFinished(exerciseName: string) {
		finishedExercises.toggleExercise({
			planId,
			week: currentWeek,
			day: currentDay,
			exerciseName
		});
	}
</script>

<section
	class="flex w-full max-w-(--breakpoint-xl) flex-col items-center gap-1 text-center text-sm lg:text-base"
>
	<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_0.5fr] gap-1">
		<h2>Exercise</h2>
		<h2>Set</h2>
		<h2>Reps</h2>
		<h2>RPE</h2>
		<h2>Weight</h2>
		<h2></h2>
	</div>
	{#each exercises as exercise}
		{#if exercise}
			{@const exerciseName = exercise.exercise_name}
			{#each Array(+exercise.sets) as _, i}
				<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_0.5fr] gap-1">
					{#if i === 0}
						<button
							class="btn btn-outline btn-sm lg:btn-md {isExerciseFinished(exerciseName)
								? 'btn-success'
								: ''}"
							on:click={() => handleExerciseClick(exerciseName)}
						>
							{exerciseName}
						</button>
					{:else}
						<div></div>
					{/if}
					<p class="flex items-center justify-center">{i + 1}</p>
					<input
						class="input input-sm input-bordered lg:input-md w-full text-center"
						type="number"
						placeholder={exercise.reps.toString()}
						disabled={!isEditable}
						on:input={(e) => updateExerciseData(exerciseName, i, 'reps', +e.currentTarget.value)}
					/>
					<input
						class="input input-sm input-bordered lg:input-md w-full text-center"
						type="number"
						placeholder={exercise.rpe.toString()}
						disabled={!isEditable}
						on:input={(e) => updateExerciseData(exerciseName, i, 'rpe', +e.currentTarget.value)}
					/>
					<input
						class="input input-sm input-bordered lg:input-md w-full text-center"
						type="number"
						placeholder={exercise.weight.toString()}
						disabled={!isEditable}
						on:input={(e) => updateExerciseData(exerciseName, i, 'weight', +e.currentTarget.value)}
					/>
					{#if i === 0}
						<label class="flex items-center justify-center">
							<input
								type="checkbox"
								class="checkbox checkbox-primary"
								checked={isExerciseFinished(exercise.exercise_name)}
								on:change={() => toggleExerciseFinished(exercise.exercise_name)}
							/>
						</label>
					{:else}
						<div></div>
					{/if}
				</div>
			{/each}
		{/if}
	{/each}
</section>

{#if selectedExercise}
	<ExerciseChartModal exerciseName={selectedExercise} isOpen={showModal} onClose={closeModal} />
{/if}
