<script lang="ts">
	let planName = '';
	let weeks = 1;
	let daysPerWeek = 1;
	let currentWeek = 0;
	let currentDay = 0;

	type Exercise = {
		exercise_name: string;
		sets: string;
		reps: string;
		rpe: string;
		weight: string;
		notes: string;
	};

	let exercises: Exercise[] = [];

	function addExercise() {
		exercises = [
			...exercises,
			{
				exercise_name: '',
				sets: '1',
				reps: '1',
				rpe: '1',
				weight: '0',
				notes: ''
			}
		];
	}

	function removeExercise(index: number) {
		exercises = exercises.filter((_, i) => i !== index);
	}

	async function savePlan() {
		const plan = {
			name: planName,
			weeks: Array(weeks)
				.fill(null)
				.map(() => ({
					days: Array(daysPerWeek)
						.fill(null)
						.map(() => ({
							exercises
						}))
				}))
		};

		try {
			const response = await fetch('/api/plans', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(plan)
			});
			if (response.ok) {
				// Reset form or show success message
				planName = '';
				exercises = [];
			}
		} catch (error) {
			console.error('Error saving plan:', error);
		}
	}
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-4 px-4 py-12 lg:py-20">
		<h1 class="text-2xl font-bold">Create Training Plan</h1>

		<div class="w-full max-w-xl space-y-4">
			<input
				type="text"
				placeholder="Plan Name"
				class="input input-bordered w-full"
				bind:value={planName}
			/>

			<div class="flex gap-4">
				<div class="form-control w-full">
					<label class="label" for="weeks">Weeks</label>
					<input
						id="weeks"
						type="number"
						min="1"
						class="input input-bordered w-full"
						bind:value={weeks}
					/>
				</div>
				<div class="form-control w-full">
					<label class="label" for="days">Days per Week</label>
					<input
						id="days"
						type="number"
						min="1"
						max="7"
						class="input input-bordered w-full"
						bind:value={daysPerWeek}
					/>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex justify-between">
					<h2 class="text-xl font-semibold">Exercises</h2>
					<button class="btn btn-primary btn-sm" on:click={addExercise}>Add Exercise</button>
				</div>

				{#each exercises as exercise, i}
					<div class="grid grid-cols-6 gap-2">
						<input
							type="text"
							placeholder="Exercise"
							class="input input-bordered input-sm col-span-2"
							bind:value={exercise.exercise_name}
						/>
						<input
							type="number"
							placeholder="Sets"
							class="input input-bordered input-sm"
							bind:value={exercise.sets}
						/>
						<input
							type="number"
							placeholder="Reps"
							class="input input-bordered input-sm"
							bind:value={exercise.reps}
						/>
						<input
							type="number"
							placeholder="RPE"
							class="input input-bordered input-sm"
							bind:value={exercise.rpe}
						/>
						<button class="btn btn-error btn-sm" on:click={() => removeExercise(i)}>Remove</button>
					</div>
				{/each}
			</div>

			<button class="btn btn-primary w-full" on:click={savePlan}>Save Plan</button>
		</div>
	</div>
</section>
