<script lang="ts">
	import {
		savePlan,
		getPlans,
		getPredefinedPlans,
		deletePlan,
		type Plan
	} from '$lib/hooks/manage-plans';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase.client';
	import { updateUserData } from '$lib/hooks/get-user-data';
	import ExerciseSelect from '$lib/components/ExerciseSelect.svelte';

	type PlanType = 'new' | 'existing' | 'predefined';
	let planType = $state<PlanType>('new');
	let existingPlans: Plan[] = $state([]);
	let predefinedPlans: Plan[] = $state([]);
	let selectedPlanId = $state('');
	let currentUserId = $state<string | undefined>(undefined);
	let planName = $state('');
	let weeks = $state(1);
	let daysPerWeek = $state(1);
	let selectedWeek = $state(0);
	let selectedDay = $state(0);

	type Exercise = {
		exercise_name: string;
		sets: string;
		reps: string;
		rpe: string;
		weight: string;
		notes: string;
	};

	type DayExercises = {
		exercises: Exercise[];
	};

	type WeekDays = {
		days: DayExercises[];
	};

	let planStructure: WeekDays[] = $state([
		{
			days: [{ exercises: [] }]
		}
	]);

	function updatePlanStructure() {
		if (weeks === undefined || daysPerWeek === undefined) return;

		// Only update if dimensions have changed
		if (planStructure.length !== weeks || planStructure[0].days.length !== daysPerWeek) {
			planStructure = Array(weeks)
				.fill(null)
				.map((_, weekIndex) => ({
					days: Array(daysPerWeek)
						.fill(null)
						.map((_, dayIndex) => ({
							exercises:
								weekIndex === selectedWeek && dayIndex === selectedDay
									? planStructure[selectedWeek]?.days[selectedDay]?.exercises || []
									: []
						}))
				}));
		}
	}

	function addExercise() {
		planStructure[selectedWeek].days[selectedDay].exercises = [
			...planStructure[selectedWeek].days[selectedDay].exercises,
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
		planStructure[selectedWeek].days[selectedDay].exercises = planStructure[selectedWeek].days[
			selectedDay
		].exercises.filter((_, i) => i !== index);
	}

	async function loadPlans() {
		try {
			[existingPlans, predefinedPlans] = await Promise.all([getPlans(), getPredefinedPlans()]);
		} catch (error) {
			console.error('Error loading plans:', error);
		}
	}

	function canEditPlan(plan: Plan | null) {
		if (!plan) return false;
		return currentUserId && plan.authorId === currentUserId;
	}

	async function handlePlanSelect() {
		if (!selectedPlanId) return;
		const plan = [...existingPlans, ...predefinedPlans].find((p) => p.id === selectedPlanId);
		if (plan) {
			planName = plan.name;
			planStructure = plan.weeks;
			weeks = plan.weeks.length;
			daysPerWeek = plan.weeks[0].days.length;
		}
	}

	async function handleSavePlan() {
		try {
			if (!currentUserId) throw new Error('Must be logged in to save plan');

			const plan = {
				name: planName,
				authorId: currentUserId,
				weeks: planStructure
			};

			// If we're editing an existing plan, include its ID
			if (planType === 'existing' && selectedPlanId) {
				await savePlan({ ...plan, id: selectedPlanId });
			} else {
				await savePlan(plan);
			}

			goto('/train');
		} catch (error) {
			console.error('Error saving plan:', error);
		}
	}

	async function handleSelectPlan() {
		if (!selectedPlanId) return;

		try {
			await updateUserData({
				selectedPlan: {
					id: selectedPlanId,
					type: planType === 'existing' ? 'user' : 'predefined'
				}
			});
			goto('/train');
		} catch (error) {
			console.error('Error selecting plan:', error);
		}
	}

	async function handleDeletePlan() {
		if (!selectedPlanId) return;

		try {
			await deletePlan(selectedPlanId);
			// Refresh plans list
			await loadPlans();
			// Reset selection
			selectedPlanId = '';
			planName = '';
			planStructure = [{ days: [{ exercises: [] }] }];
		} catch (error) {
			console.error('Error deleting plan:', error);
		}
	}

	$effect(() => {
		updatePlanStructure();
	});

	onMount(() => {
		loadPlans();
		const unsubscribe = auth.onAuthStateChanged((user) => {
			currentUserId = user?.uid;
		});
		return unsubscribe;
	});
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-4 px-4 py-12 lg:py-20">
		<h1 class="text-2xl font-bold">Training Plan</h1>

		<div class="w-full max-w-xl space-y-4">
			<div class="flex gap-2">
				<button
					class="btn flex-1 {planType === 'new' ? 'btn-primary' : 'btn-outline'}"
					onclick={() => (planType = 'new')}
				>
					Create New
				</button>
				<button
					class="btn flex-1 {planType === 'existing' ? 'btn-primary' : 'btn-outline'}"
					onclick={() => (planType = 'existing')}
				>
					My Plans
				</button>
				<button
					class="btn flex-1 {planType === 'predefined' ? 'btn-primary' : 'btn-outline'}"
					onclick={() => (planType = 'predefined')}
				>
					Predefined
				</button>
			</div>

			{#if planType === 'new'}
				<input
					type="text"
					placeholder="Plan Name"
					class="input input-bordered w-full"
					bind:value={planName}
				/>
			{:else}
				<select
					class="select select-bordered w-full"
					bind:value={selectedPlanId}
					onchange={handlePlanSelect}
				>
					<option value="">Select a plan</option>
					{#if planType === 'existing'}
						{#each existingPlans as plan}
							<option value={plan.id}>{plan.name}</option>
						{/each}
					{:else}
						{#each predefinedPlans as plan}
							<option value={plan.id}>{plan.name}</option>
						{/each}
					{/if}
				</select>
			{/if}

			{#if planType === 'new' || (selectedPlanId && canEditPlan(existingPlans.find((p) => p.id === selectedPlanId) || predefinedPlans.find((p) => p.id === selectedPlanId) || null))}
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

				<div class="flex gap-4">
					<select class="select select-bordered w-full" bind:value={selectedWeek}>
						{#each Array(weeks) as _, i}
							<option value={i}>Week {i + 1}</option>
						{/each}
					</select>

					<select class="select select-bordered w-full" bind:value={selectedDay}>
						{#each Array(daysPerWeek) as _, i}
							<option value={i}>Day {i + 1}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-4">
					<div class="flex justify-between">
						<h2 class="text-xl font-semibold">
							Exercises for Week {selectedWeek + 1}, Day {selectedDay + 1}
						</h2>
						<button class="btn btn-primary btn-sm" onclick={addExercise}>Add Exercise</button>
					</div>

					{#each planStructure[selectedWeek].days[selectedDay].exercises as exercise, i}
						<div class="grid grid-cols-6 gap-2">
							<ExerciseSelect bind:value={exercise.exercise_name} placeholder="Exercise name" />
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
							<button class="btn btn-error btn-sm" onclick={() => removeExercise(i)}>Remove</button>
						</div>
					{/each}
				</div>

				{#if planType === 'existing' && selectedPlanId}
					<div class="flex gap-2">
						<button class="btn btn-error flex-1" onclick={handleDeletePlan}> Delete Plan </button>
						<button class="btn btn-primary flex-1" onclick={handleSavePlan}> Save Changes </button>
					</div>
				{:else if planType === 'new'}
					<button class="btn btn-primary w-full" onclick={handleSavePlan}> Save Plan </button>
				{/if}
			{:else if selectedPlanId}
				<div class="alert alert-info">
					<span>This plan can only be viewed. Create a copy to modify it.</span>
					<button
						class="btn btn-primary btn-sm"
						onclick={() => {
							planType = 'new';
							planName = `Copy of ${planName}`;
						}}
					>
						Create Copy
					</button>
				</div>

				<button class="btn btn-primary w-full" onclick={handleSelectPlan}> Select Plan </button>
			{/if}
		</div>
	</div>
</section>
