<script lang="ts">
	import { onMount } from 'svelte';
	import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
	import { app, auth } from '$lib/firebase.client';
	import { getUserData } from '$lib/hooks/get-user-data';

	type ExerciseLog = {
		exercise_name: string;
		reps: number;
		weight: number;
		rpe: number;
		date: Date;
	};

	let selectedExercise = '';
	let exercises: string[] = [];
	let exerciseLogs: ExerciseLog[] = [];
	let timeRange = '30'; // days

	async function fetchExercises() {
		const userData = await getUserData();
		if (!userData) return;

		const currentUserId = auth.currentUser?.uid;
		if (!currentUserId) return;

		const db = getFirestore(app);
		const logsRef = collection(db, 'users', currentUserId, 'exercise_logs');
		const querySnapshot = await getDocs(logsRef);

		// Get unique exercise names
		const uniqueExercises = new Set<string>();
		querySnapshot.forEach((doc) => {
			uniqueExercises.add(doc.data().exercise_name);
		});
		exercises = Array.from(uniqueExercises).sort();
	}

	async function fetchExerciseLogs() {
		if (!selectedExercise) return;

		const currentUserId = auth.currentUser?.uid;
		if (!currentUserId) return;

		const db = getFirestore(app);
		const logsRef = collection(db, 'users', currentUserId, 'exercise_logs');

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - parseInt(timeRange));

		const q = query(
			logsRef,
			where('exercise_name', '==', selectedExercise),
			where('date', '>=', startDate)
		);

		const querySnapshot = await getDocs(q);
		exerciseLogs = querySnapshot.docs.map((doc) => ({
			...doc.data(),
			date: doc.data().date.toDate()
		})) as ExerciseLog[];
	}

	function calculateStats() {
		if (!exerciseLogs.length) return null;

		const maxWeight = Math.max(...exerciseLogs.map((log) => log.weight));
		const avgWeight = exerciseLogs.reduce((sum, log) => sum + log.weight, 0) / exerciseLogs.length;
		const maxReps = Math.max(...exerciseLogs.map((log) => log.reps));
		const avgReps = exerciseLogs.reduce((sum, log) => sum + log.reps, 0) / exerciseLogs.length;

		return {
			maxWeight: maxWeight.toFixed(1),
			avgWeight: avgWeight.toFixed(1),
			maxReps,
			avgReps: avgReps.toFixed(1)
		};
	}

	$: if (selectedExercise || timeRange) {
		fetchExerciseLogs();
	}

	onMount(() => {
		fetchExercises();
	});
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-4 px-4 py-12 lg:py-20">
		<h1 class="text-2xl font-bold">Exercise Statistics</h1>

		<div class="w-full max-w-xl space-y-6">
			<div class="flex gap-4">
				<select class="select select-bordered w-full" bind:value={selectedExercise}>
					<option value="">Select Exercise</option>
					{#each exercises as exercise}
						<option value={exercise}>{exercise}</option>
					{/each}
				</select>

				<select class="select select-bordered w-48" bind:value={timeRange}>
					<option value="7">Last 7 days</option>
					<option value="30">Last 30 days</option>
					<option value="90">Last 90 days</option>
					<option value="365">Last year</option>
				</select>
			</div>

			{#if selectedExercise && exerciseLogs.length}
				{@const stats = calculateStats()}
				{#if stats}
					<div class="grid grid-cols-2 gap-4">
						<div class="stats shadow">
							<div class="stat">
								<div class="stat-title">Max Weight</div>
								<div class="stat-value">{stats.maxWeight}kg</div>
							</div>
						</div>
						<div class="stats shadow">
							<div class="stat">
								<div class="stat-title">Avg Weight</div>
								<div class="stat-value">{stats.avgWeight}kg</div>
							</div>
						</div>
						<div class="stats shadow">
							<div class="stat">
								<div class="stat-title">Max Reps</div>
								<div class="stat-value">{stats.maxReps}</div>
							</div>
						</div>
						<div class="stats shadow">
							<div class="stat">
								<div class="stat-title">Avg Reps</div>
								<div class="stat-value">{stats.avgReps}</div>
							</div>
						</div>
					</div>

					<div class="overflow-x-auto">
						<table class="table-zebra table">
							<thead>
								<tr>
									<th>Date</th>
									<th>Weight</th>
									<th>Reps</th>
									<th>RPE</th>
								</tr>
							</thead>
							<tbody>
								{#each exerciseLogs.sort((a, b) => b.date.getTime() - a.date.getTime()) as log}
									<tr>
										<td>{log.date.toLocaleDateString()}</td>
										<td>{log.weight}kg</td>
										<td>{log.reps}</td>
										<td>{log.rpe}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			{:else if selectedExercise}
				<div class="alert">No data available for the selected time range.</div>
			{/if}
		</div>
	</div>
</section>
