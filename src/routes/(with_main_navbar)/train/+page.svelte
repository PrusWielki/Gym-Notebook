<script lang="ts">
	import { browser } from '$app/environment';
	import { getUserData, type UserData } from '$lib/hooks/get-user-data';
	import TrainingDay from '$lib/components/TrainingDay.svelte';
	import { saveTrainingLog, getPlan, type Plan } from '$lib/hooks/manage-plans';

	let userData: UserData | null = $state(null);
	let plan: Plan | null = $state(null);
	let selectedWeek = $state(0);
	let selectedDay = $state(0);
	let weeksCount = $state(0);
	let daysCount = $state(0);
	let exerciseDataToSave: Record<
		string,
		Array<{ sets: number; reps: number; rpe: number; weight: number }>
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

	$effect(() => {
		// console.log(userData?.currentWeek);
		// console.log(plan?.weeks[selectedWeek].days[selectedDay].exercises[0].exercise_name);
	});

	async function handleSaveTraining() {
		if (!plan) return;

		try {
			await saveTrainingLog(
				userData?.currentPlan ?? '',
				selectedWeek,
				selectedDay,
				exerciseDataToSave
			);
			// Maybe show success message or reset form
		} catch (error) {
			console.error('Error saving training log:', error);
			// Show error message
		}
	}
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-2 px-4 py-12 lg:py-20">
		{#if plan}
			<section class="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
				<h1 class="text-base font-semibold lg:text-xl">{userData?.currentPlan}</h1>
				<div class="flex flex-row gap-2 lg:inline-flex">
					<select
						class="select select-primary select-sm lg:select-md text-sm lg:text-base"
						bind:value={selectedWeek}
						onclick={(e) => (selectedWeek = +e.currentTarget.value)}
					>
						{#each Array(weeksCount) as _, i}
							<option value={i}>Week {i + 1}</option>
						{/each}
					</select>
					<select
						class="select select-primary select-sm lg:select-md appearance-none text-sm lg:text-base"
						bind:value={selectedDay}
						onclick={(e) => (selectedDay = +e.currentTarget.value)}
					>
						{#each Array(daysCount) as _, i}
							<option value={i}>Day {i + 1}</option>
						{/each}
					</select>
				</div>
			</section>
			<TrainingDay
				exercises={plan['weeks'][selectedWeek]['days'][selectedDay]['exercises']}
				isEditable={true}
				bind:exerciseData={exerciseDataToSave}
			/>
			<button class="btn btn-primary mt-4 w-1/2 max-w-md" onclick={handleSaveTraining}>
				Save
			</button>
		{/if}
	</div>
</section>
