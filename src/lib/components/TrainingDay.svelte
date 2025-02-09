<script lang="ts">
	export let exercises: Array<{
		exercise_name: string;
		sets: string | number;
		reps: string | number;
		rpe: string | number;
		weight: string | number;
		notes?: string;
	}>;
	export let isEditable = false;

	type ExerciseData = {
		sets: number;
		reps: number;
		rpe: number;
		weight: number;
	};

	let exerciseDataToSave: Record<string, ExerciseData[]> = {};

	const initializeExerciseData = (exerciseName: string, setCount: string | number) => {
		if (!exerciseDataToSave[exerciseName]) {
			exerciseDataToSave[exerciseName] = Array(+setCount).fill({
				sets: 1,
				reps: 0,
				rpe: 0,
				weight: 0
			});
		}
	};

	const updateExerciseData = (
		exerciseName: string,
		setIndex: number,
		field: keyof ExerciseData,
		value: number
	) => {
		exerciseDataToSave[exerciseName][setIndex] = {
			...exerciseDataToSave[exerciseName][setIndex],
			[field]: value
		};
	};
</script>

<section
	class="flex w-full max-w-(--breakpoint-xl) flex-col items-center gap-1 text-center text-sm lg:text-base"
>
	<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
		<h2>Exercise</h2>
		<h2>Set</h2>
		<h2>Reps</h2>
		<h2>RPE</h2>
		<h2>Weight</h2>
	</div>
	{#each exercises as exercise}
		{#if exercise}
			{@const exerciseName = exercise.exercise_name}
			{#each Array(+exercise.sets) as _, i}
				{@const setIndex = i}
				{initializeExerciseData(exerciseName, exercise.sets)}
				<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
					{#if i === 0}
						<button class="btn btn-outline btn-sm lg:btn-md">{exerciseName}</button>
					{:else}
						<div></div>
					{/if}
					<p class="flex items-center justify-center">{i + 1}</p>
					<input
						class="input input-sm input-bordered lg:input-md flex w-full [appearance:textfield] items-center justify-center text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						type="number"
						placeholder={exercise.reps.toString()}
						disabled={!isEditable}
						on:input={(e) =>
							updateExerciseData(exerciseName, setIndex, 'reps', +e.currentTarget.value)}
					/>
					<input
						class="input input-sm input-bordered lg:input-md flex w-full [appearance:textfield] items-center justify-center text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						type="number"
						placeholder={exercise.rpe.toString()}
						disabled={!isEditable}
						on:input={(e) =>
							updateExerciseData(exerciseName, setIndex, 'rpe', +e.currentTarget.value)}
					/>
					<input
						class="input input-sm input-bordered lg:input-md flex w-full [appearance:textfield] items-center justify-center text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						type="number"
						placeholder={exercise.weight.toString()}
						disabled={!isEditable}
						on:input={(e) =>
							updateExerciseData(exerciseName, setIndex, 'weight', +e.currentTarget.value)}
					/>
				</div>
			{/each}
		{/if}
	{/each}
</section>
