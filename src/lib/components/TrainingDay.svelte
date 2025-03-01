<script lang="ts">
	import ExerciseChartModal from './ExerciseChartModal.svelte';
	import { finishedExercises } from '$lib/store/finished-exercises';
	import { trainingData } from '$lib/store/training-data';

	interface Props {
		exercises: Array<{
			exercise_name: string;
			sets: string | number;
			reps: string | number;
			rpe: string | number;
			weight: string | number;
		}>;
		isEditable: boolean;
		exerciseData: Record<
			string,
			Array<{ sets: number; reps: number; rpe: number; weight: number }>
		>;
		planId: string;
		currentWeek: number;
		currentDay: number;
	}

	let {
		exercises = [],
		isEditable = false,
		exerciseData = $bindable({}),
		planId = '',
		currentWeek = 0,
		currentDay = 0
	}: Props = $props();

	let selectedExercise: string | null = $state(null);
	let showModal = $state(false);

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
		// Update local exercise data for parent component
		if (!exerciseData[exerciseName]) {
			const exercise = exercises.find((e) => e.exercise_name === exerciseName);
			const numSets = exercise ? +exercise.sets : 0;
			exerciseData[exerciseName] = Array(numSets)
				.fill(null)
				.map(() => ({ sets: 1, reps: 0, rpe: 0, weight: 0 }));
		}

		exerciseData[exerciseName][setIndex] = {
			...exerciseData[exerciseName][setIndex],
			[field]: value
		};
		exerciseData = exerciseData;

		// Update persistent storage
		trainingData.updateExerciseData(
			planId,
			currentWeek,
			currentDay,
			exerciseName,
			setIndex,
			field,
			value
		);
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

	// Initialize input values from stored data
	$effect(() => {
		if (
			$trainingData &&
			$trainingData.planId === planId &&
			$trainingData.week === currentWeek &&
			$trainingData.day === currentDay
		) {
			exerciseData = $trainingData.exerciseData;
		}
	});

	// Initialize input values when component mounts or when plan/week/day changes
	$effect(() => {
		if (
			$trainingData &&
			$trainingData.planId === planId &&
			$trainingData.week === currentWeek &&
			$trainingData.day === currentDay
		) {
			// Update input values with saved data
			exercises.forEach((exercise) => {
				const exerciseName = exercise.exercise_name;
				const savedData = $trainingData.exerciseData[exerciseName];
				if (savedData) {
					const inputs = document.querySelectorAll(`input[data-exercise="${exerciseName}"]`);
					inputs.forEach((input, index) => {
						const inputElement = input as HTMLInputElement;
						if (savedData[index]) {
							inputElement.value =
								savedData[index][
									inputElement.dataset.field as keyof (typeof savedData)[0]
								].toString();
						}
					});
				}
			});
		}
	});
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
		<div></div>
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
							onclick={() => handleExerciseClick(exerciseName)}
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
						data-exercise={exerciseName}
						data-field="reps"
						value={exerciseData[exerciseName]?.[i]?.reps ?? ''}
						oninput={(e) => updateExerciseData(exerciseName, i, 'reps', +e.currentTarget.value)}
					/>
					<input
						class="input input-sm input-bordered lg:input-md w-full text-center"
						type="number"
						placeholder={exercise.rpe.toString()}
						disabled={!isEditable}
						data-exercise={exerciseName}
						data-field="rpe"
						value={exerciseData[exerciseName]?.[i]?.rpe ?? ''}
						oninput={(e) => updateExerciseData(exerciseName, i, 'rpe', +e.currentTarget.value)}
					/>
					<input
						class="input input-sm input-bordered lg:input-md w-full text-center"
						type="number"
						placeholder={exercise.weight.toString()}
						disabled={!isEditable}
						data-exercise={exerciseName}
						data-field="weight"
						value={exerciseData[exerciseName]?.[i]?.weight ?? ''}
						oninput={(e) => updateExerciseData(exerciseName, i, 'weight', +e.currentTarget.value)}
					/>
					{#if i === 0}
						<label class="flex items-center justify-center">
							<input
								type="checkbox"
								class="checkbox checkbox-primary"
								checked={isExerciseFinished(exercise.exercise_name)}
								onchange={() => toggleExerciseFinished(exercise.exercise_name)}
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
