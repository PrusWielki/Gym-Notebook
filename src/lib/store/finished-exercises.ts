import { writable } from 'svelte/store';

export type FinishedExercise = {
	planId: string;
	week: number;
	day: number;
	exerciseName: string;
};

function createFinishedExercisesStore() {
	const { subscribe, set, update } = writable<FinishedExercise[]>([]);

	return {
		subscribe,
		toggleExercise: (exercise: FinishedExercise) =>
			update((exercises) => {
				const exists = exercises.some(
					(e) =>
						e.planId === exercise.planId &&
						e.week === exercise.week &&
						e.day === exercise.day &&
						e.exerciseName === exercise.exerciseName
				);

				if (exists) {
					return exercises.filter(
						(e) =>
							!(
								e.planId === exercise.planId &&
								e.week === exercise.week &&
								e.day === exercise.day &&
								e.exerciseName === exercise.exerciseName
							)
					);
				}

				return [...exercises, exercise];
			}),
		reset: () => set([])
	};
}

export const finishedExercises = createFinishedExercisesStore();
