<script lang="ts">
	import { browser } from '$app/environment';
	import { getExercises, type Exercise } from '$lib/hooks/get-exercises';
	import { getPlan, type Plan } from '$lib/hooks/get-plan';
	import { getUserData, type UserData } from '$lib/hooks/get-user-data';

	let exercises: Array<Exercise> | null = $state(null);
	let userData: UserData | null = $state(null);
	let plan: Plan | null = $state(null);
	let selectedWeek = $state(0);
	let selectedDay = $state(0);
	if (browser) {
		getExercises().then((data) => (exercises = data));
		getUserData().then((data) => {
			if (data) {
				userData = data;
				selectedWeek = data.currentWeek;
				selectedDay = data.currentDay;
				getPlan(userData.currentPlan).then((data) => {
					if (data) {
						plan = data;
						trainingData = data.weeks[selectedWeek].days[selectedDay].exercises;
					}
				});
			}
		});
	}

	let trainingData: null | Plan['weeks']['0']['days']['0']['exercises'] = $state(null);

	$effect(() => {
		// console.log(exercises && exercises[0].exercise_name);
		// console.log(userData?.currentWeek);
		// console.log(plan?.weeks[selectedWeek].days[selectedDay].exercises[0].exercise_name);
	});

	// 1. First fetch the user's data, what plan is currently selected
	// 2. Fetch the specific week and day of the plan, don't fetch the whole plan
	// 2. Map it

	// Database structure:
	// 1. Exercises table, simply a list of available exercises
	// 2. Plans table, Plans that have a plan name, weeks and days with specific exercises
	// 3. Users table that holds current day, week, plan
	// 4. Exercises log table that holds exercise data for each user, each table is a separate exercise type that holds the log
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-screen-xl flex-col gap-1 px-4 py-12 lg:py-20">
		<section class="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
			<h1 class="text-base font-semibold lg:text-xl">Plan Name</h1>
			<div class="flex flex-row gap-2 lg:inline-flex">
				<select
					class="select select-primary select-sm text-sm lg:select-md lg:text-base"
					bind:value={selectedWeek}
					onchange={(e: { currentTarget: { value: string | number } }) => {
						selectedWeek = +e.currentTarget.value;
					}}><option value={0}>Week 1</option></select
				>
				<select
					class="select select-primary select-sm appearance-none text-sm lg:select-md lg:text-base"
					bind:value={selectedDay}
					onchange={(e: { currentTarget: { value: string | number } }) => {
						selectedDay = +e.currentTarget.value;
					}}
				>
					<option value={0}>Day 1</option></select
				>
			</div>
		</section>
		<section
			class="flex w-full max-w-screen-xl flex-col items-center gap-1 text-center text-sm lg:text-base"
		>
			<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
				<h2>Exercise</h2>
				<h2>Set</h2>
				<h2>Reps</h2>
				<h2>RPE</h2>
				<h2>Weight</h2>
			</div>
			{#if trainingData !== null}
				{#each trainingData as exercise}
					<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
						<button class="btn btn-ghost btn-sm lg:btn-md">{exercise.exercise_name}</button>
						<input
							class="input input-sm input-bordered flex w-full items-center justify-center text-center [appearance:textfield] lg:input-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
							type="number"
							placeholder={exercise.sets}
						/>
						<input
							class="input input-sm input-bordered flex w-full items-center justify-center text-center [appearance:textfield] lg:input-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
							type="number"
							placeholder={exercise.reps}
						/>
						<input
							class="input input-sm input-bordered flex w-full items-center justify-center text-center [appearance:textfield] lg:input-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
							type="number"
							placeholder={exercise.rpe}
						/>
						<input
							class="input input-sm input-bordered flex w-full items-center justify-center text-center [appearance:textfield] lg:input-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
							type="number"
							placeholder={exercise.weight}
						/>
					</div>
				{/each}
			{/if}
			<!-- <div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
				<button class="btn btn-ghost btn-sm lg:btn-md">Dumbell Chest Press</button>
				<input
					class="input input-sm input-bordered flex w-full items-center justify-center text-center [appearance:textfield] lg:input-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					type="number"
					value="1"
				/>
				<input
					class="input input-sm input-bordered flex w-full items-center justify-center text-center [appearance:textfield] lg:input-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					type="number"
					value="12"
				/>
				<input
					class="input input-sm input-bordered flex w-full items-center justify-center text-center [appearance:textfield] lg:input-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					type="number"
					value="10"
				/>
				<input
					class="input input-sm input-bordered flex w-full items-center justify-center text-center [appearance:textfield] lg:input-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					type="number"
					value="90"
				/>
			</div> -->
		</section>
	</div>
</section>
