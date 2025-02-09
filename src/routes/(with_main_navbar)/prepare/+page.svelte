<script lang="ts">
	import { savePlan, getPlans, type Plan } from '$lib/hooks/manage-plans';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isNewPlan = $state(true);
	let existingPlans: (Plan & { id: string })[] = $state([]);
	let selectedPlanId = $state('');
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
			existingPlans = await getPlans();
		} catch (error) {
			console.error('Error loading plans:', error);
		}
	}

	async function handlePlanSelect() {
		if (!selectedPlanId) return;
		const plan = existingPlans.find((p) => p.id === selectedPlanId);
		if (plan) {
			planName = plan.name;
			planStructure = plan.weeks;
			weeks = plan.weeks.length;
			daysPerWeek = plan.weeks[0].days.length;
		}
	}

	async function handleSavePlan() {
		try {
			const plan = {
				name: planName,
				weeks: planStructure
			};

			await savePlan(plan);
			goto('/train');
		} catch (error) {
			console.error('Error saving plan:', error);
		}
	}

	$effect(() => {
		if (weeks !== undefined && daysPerWeek !== undefined) {
			updatePlanStructure();
		}
	});

	onMount(() => {
		loadPlans();
	});
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-4 px-4 py-12 lg:py-20">
		<h1 class="text-2xl font-bold">Training Plan</h1>

		<div class="w-full max-w-xl space-y-4">
			<div class="flex gap-4">
				<button
					class="btn flex-1 {isNewPlan ? 'btn-primary' : 'btn-outline'}"
					onclick={() => (isNewPlan = true)}
				>
					Create New Plan
				</button>
				<button
					class="btn flex-1 {!isNewPlan ? 'btn-primary' : 'btn-outline'}"
					onclick={() => (isNewPlan = false)}
				>
					Use Existing Plan
				</button>
			</div>

			{#if isNewPlan}
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
					{#each existingPlans as plan}
						<option value={plan.id}>{plan.name}</option>
					{/each}
				</select>
			{/if}

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
						<button class="btn btn-error btn-sm" onclick={() => removeExercise(i)}>Remove</button>
					</div>
				{/each}
			</div>

			<button class="btn btn-primary w-full" onclick={handleSavePlan}>Save Plan</button>
		</div>
	</div>
</section>
