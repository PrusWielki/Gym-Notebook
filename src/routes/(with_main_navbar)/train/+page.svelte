<script lang="ts">
	import { browser } from '$app/environment';
	import { getUserData, updateUserData, type UserData } from '$lib/hooks/get-user-data';
	import TrainingDay from '$lib/components/TrainingDay.svelte';
	import {
		saveTrainingLog,
		getPlan,
		getPlans,
		getPredefinedPlans,
		type Plan
	} from '$lib/hooks/manage-plans';
	import { onMount } from 'svelte';

	let userData: UserData | null = $state(null);
	let plan: Plan | null = $state(null);
	let selectedWeek = $state(0);
	let selectedDay = $state(0);
	let weeksCount = $state(0);
	let daysCount = $state(0);
	let allPlans: (Plan & { type: 'user' | 'predefined' })[] = $state([]);
	let exerciseDataToSave: Record<
		string,
		Array<{ sets: number; reps: number; rpe: number; weight: number }>
	> = $state({});

	async function loadAllPlans() {
		const [userPlans, predefinedPlans] = await Promise.all([getPlans(), getPredefinedPlans()]);

		allPlans = [
			...userPlans.map((plan) => ({ ...plan, type: 'user' as const })),
			...predefinedPlans.map((plan) => ({ ...plan, type: 'predefined' as const }))
		];
	}

	async function handlePlanSelect(planId: string) {
		if (!planId) return;

		try {
			const selectedPlanType = allPlans.find((p) => p.id === planId)?.type ?? 'user';
			const selectedPlan = allPlans.find((p) => p.id === planId);

			// Update user data with selected plan info
			await updateUserData({
				selectedPlan: {
					id: planId,
					type: selectedPlanType
				},
				currentPlan: selectedPlan?.name || '', // Save plan name
				currentWeek: 0, // Reset week and day when selecting new plan
				currentDay: 0
			});

			const planData = await getPlan(planId);
			if (planData) {
				plan = planData;
				weeksCount = planData.weeks.length;
				daysCount = planData.weeks[0].days.length;
				selectedWeek = 0;
				selectedDay = 0;

				// Update local userData state
				userData = {
					...userData,
					selectedPlan: {
						id: planId,
						type: selectedPlanType
					},
					currentPlan: selectedPlan?.name || '',
					currentWeek: 0,
					currentDay: 0
				} as UserData;
			}
		} catch (error) {
			console.error('Error selecting plan:', error);
		}
	}

	async function initializePlanFromId(planId: string) {
		const planData = await getPlan(planId);
		if (planData) {
			plan = planData;
			weeksCount = planData.weeks.length;
			daysCount = planData.weeks[0].days.length;
		}
		return planData;
	}

	onMount(async () => {
		try {
			// Load all plans first
			await loadAllPlans();

			if (browser) {
				const data = await getUserData();
				userData = data ?? null;

				if (userData?.selectedPlan?.id) {
					selectedWeek = userData.currentWeek ?? 0;
					selectedDay = userData.currentDay ?? 0;

					// Initialize plan data
					const planData = await initializePlanFromId(userData.selectedPlan.id);

					if (planData) {
						// Set plan and dimensions
						plan = planData;
						weeksCount = planData.weeks.length;
						daysCount = planData.weeks[0].days.length;

						// Ensure the select element reflects the current plan
						const select = document.getElementById('plan-select') as HTMLSelectElement;
						if (select) {
							select.value = userData.selectedPlan.id;
						}
					}
				}
			}
		} catch (e) {
			console.error('Error initializing training page:', e);
		}
	});

	async function handleSaveTraining() {
		if (!plan) return;

		try {
			// Save the training log
			await saveTrainingLog(
				userData?.selectedPlan?.id ?? '',
				selectedWeek,
				selectedDay,
				exerciseDataToSave
			);

			// Calculate next position
			let nextDay = selectedDay + 1;
			let nextWeek = selectedWeek;

			// If we've reached the end of the week
			if (nextDay >= daysCount) {
				nextDay = 0;
				nextWeek++;
				// If we've reached the end of the plan
				if (nextWeek >= weeksCount) {
					nextWeek = 0;
				}
			}

			// Update user data with new position
			await updateUserData({
				currentWeek: nextWeek,
				currentDay: nextDay
			});

			// Update local state
			selectedWeek = nextWeek;
			selectedDay = nextDay;
			exerciseDataToSave = {};

			// Show success message
			alert('Training saved! Moving to next day.');
		} catch (error) {
			console.error('Error saving training log:', error);
			alert('Error saving training. Please try again.');
		}
	}
</script>

<section class="h-[100dvh] w-full py-4">
	<div class="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-4 px-4 py-12 lg:py-20">
		<div class="form-control w-full max-w-md">
			<label class="label my-1" for="plan-select">
				<span class="label-text">Select a Training Plan</span>
			</label>
			<select
				id="plan-select"
				class="select select-bordered w-full"
				value={userData?.selectedPlan?.id ?? ''}
				onchange={(e) => handlePlanSelect(e.currentTarget.value)}
			>
				<option value="">Choose a plan</option>
				{#each allPlans as plan}
					<option value={plan.id} selected={plan.id === userData?.selectedPlan?.id}>
						{plan.name}
						{plan.type === 'predefined' ? '(Predefined)' : '(My Plan)'}
					</option>
				{/each}
			</select>
		</div>

		{#if !plan}
			<div class="alert alert-info">
				<span>Select a plan to start training</span>
			</div>
		{:else}
			<section class="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
				<h1 class="text-base font-semibold lg:text-xl">{userData?.currentPlan}</h1>
				<div class="flex flex-row gap-2 lg:inline-flex">
					<select
						class="select select-primary select-sm lg:select-md w-full text-sm lg:text-base"
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
