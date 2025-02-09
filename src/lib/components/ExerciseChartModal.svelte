<script lang="ts">
	import { onMount } from 'svelte';
	import { app, auth, db } from '$lib/firebase.client';
	import {
		collection,
		query,
		where,
		getDocs,
		orderBy,
		Timestamp,
		getFirestore
	} from 'firebase/firestore';
	import ExerciseChart from './ExerciseChart.svelte';

	const { exerciseName, isOpen, onClose } = $props<{
		exerciseName: string;
		isOpen: boolean;
		onClose: () => void;
	}>();

	type ExerciseLog = {
		date: Date;
		weight: number;
		rpe: number;
		exercise_name: string;
		reps: number;
	};

	let exerciseData = $state([]) as ExerciseLog[];
	let loading = $state(true);

	async function fetchExerciseLogs() {
		const currentUserId = auth.currentUser?.uid;
		if (!currentUserId) return;

		const db = getFirestore(app);
		const logsRef = collection(db, 'users', currentUserId, 'exercise_logs');

		// const startDate = new Date();
		// startDate.setDate(startDate.getDate() - parseInt(timeRange));

		const q = query(
			logsRef,
			where('exercise_name', '==', exerciseName)
			// where('date', '>=', startDate)
		);

		const querySnapshot = await getDocs(q);
		exerciseData = querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				...data,
				date: (data.date as Timestamp).toDate()
			} as ExerciseLog;
		});
	}

	onMount(async () => {
		loading = true;
		await fetchExerciseLogs();
		loading = false;
	});
</script>

{#if isOpen}
	<div class="modal modal-open">
		<div class="modal-box max-w-3xl">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" onclick={onClose}
				>✕</button
			>
			<h3 class="mb-4 text-lg font-bold">{exerciseName}</h3>
			{#if loading}
				<div class="flex h-[300px] items-center justify-center">
					<span class="loading loading-spinner loading-lg"></span>
				</div>
			{:else}
				<ExerciseChart data={exerciseData} />
			{/if}
		</div>
		<button
			type="button"
			class="modal-backdrop"
			onclick={onClose}
			onkeydown={(e) => e.key === 'Escape' && onClose()}
			aria-label="Close modal"
		></button>
	</div>
{/if}
