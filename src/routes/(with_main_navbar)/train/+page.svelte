<script lang="ts">
	import { browser } from '$app/environment';
	import { getPlan, type Plan } from '$lib/hooks/get-plan';
	import { getUserData, type UserData } from '$lib/hooks/get-user-data';

	let userData: UserData | null = $state(null);
	let plan: Plan | null = $state(null);
	let selectedWeek = $state(0);
	let selectedDay = $state(0);
	let weeksCount = $state(0);
	let daysCount = $state(0);
	let exerciseDataToSave: Record<
		string,
		{ sets: number; reps: number; rpe: number; weight: number }[]
	> = $state({});

	if (browser) {
		getUserData()
			.then((data) => {
				userData = data ?? null;
				if (userData) {
					selectedWeek = userData.currentWeek;
					selectedDay = userData.currentDay;
					getPlan(userData.currentPlan)
						.then((planData) => {
							plan = planData ?? null;
							if (plan) {
								weeksCount = plan.weeks.length;
								daysCount = plan.weeks[0].days.length;
							}
						})
						.catch((e) => console.error('Error fetching plan:', e));
				}
			})
			.catch((e) => console.error('Error fetching user data:', e));
	}

	const updataDataArray = (exerciseName: string) => {
		if (!(exerciseName in exerciseDataToSave)) {
			exerciseDataToSave[exerciseName].push({ sets: 1, reps: 1, rpe: 1, weight: 1 });
		} else {
			exerciseDataToSave[exerciseName] = [{ sets: 1, reps: 1, rpe: 1, weight: 1 }];
		}
	};

	$effect(() => {
		// console.log(userData?.currentWeek);
		// console.log(plan?.weeks[selectedWeek].days[selectedDay].exercises[0].exercise_name);
	});
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-screen-xl flex-col items-center gap-2 px-4 py-12 lg:py-20">
		{#if plan}
			<section class="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
				<h1 class="text-base font-semibold lg:text-xl">{userData?.currentPlan}</h1>
				<div class="flex flex-row gap-2 lg:inline-flex">
					<select
						class="select select-primary select-sm text-sm lg:select-md lg:text-base"
						bind:value={selectedWeek}
						onchange={(e: { currentTarget: { value: string | number } }) => {
							selectedWeek = +e.currentTarget.value;
						}}
					>
						{#each Array(weeksCount) as _, i}
							<option value={i}>Week {i + 1}</option>
						{/each}
					</select>
					<select
						class="select select-primary select-sm appearance-none text-sm lg:select-md lg:text-base"
						bind:value={selectedDay}
						onchange={(e: { currentTarget: { value: string | number } }) => {
							selectedDay = +e.currentTarget.value;
						}}
					>
						{#each Array(daysCount) as _, i}
							<option value={i}>Day {i + 1}</option>
						{/each}
					</select>
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
				{#if plan['weeks'][selectedWeek]['days'][selectedDay]['exercises']}
					{#each plan['weeks'][selectedWeek]['days'][selectedDay]['exercises'] as exercise}
						{#each Array(+exercise.sets) as _, i}
							<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
								{#if i === 0}
									<button class="btn btn-outline btn-sm lg:btn-md">{exercise.exercise_name}</button>
								{:else}
									<div></div>
								{/if}
								<p class="flex items-center justify-center">{i + 1}</p>
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
					{/each}
				{/if}
			</section>
			<button class="btn btn-primary mt-4 w-1/2 max-w-md">Save</button>
		{/if}
	</div>
</section>
