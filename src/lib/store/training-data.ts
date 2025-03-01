import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ExerciseData = {
	planId: string;
	week: number;
	day: number;
	exerciseData: Record<string, Array<{ sets: number; reps: number; rpe: number; weight: number }>>;
};

function createTrainingDataStore() {
	const storedData = browser ? localStorage.getItem('trainingData') : null;
	const initialData: ExerciseData | null = storedData ? JSON.parse(storedData) : null;

	const { subscribe, set, update } = writable<ExerciseData | null>(initialData);

	return {
		subscribe,
		setTrainingData: (data: ExerciseData) => {
			if (browser) {
				localStorage.setItem('trainingData', JSON.stringify(data));
			}
			set(data);
		},
		updateExerciseData: (
			planId: string,
			week: number,
			day: number,
			exerciseName: string,
			setIndex: number,
			field: 'sets' | 'reps' | 'rpe' | 'weight',
			value: number
		) => {
			update((currentData) => {
				if (
					!currentData ||
					currentData.planId !== planId ||
					currentData.week !== week ||
					currentData.day !== day
				) {
					currentData = { planId, week, day, exerciseData: {} };
				}

				if (!currentData.exerciseData[exerciseName]) {
					currentData.exerciseData[exerciseName] = [];
				}

				// Ensure array has enough entries
				while (currentData.exerciseData[exerciseName].length <= setIndex) {
					currentData.exerciseData[exerciseName].push({ sets: 1, reps: 0, rpe: 0, weight: 0 });
				}

				currentData.exerciseData[exerciseName][setIndex] = {
					...currentData.exerciseData[exerciseName][setIndex],
					[field]: value
				};

				if (browser) {
					localStorage.setItem('trainingData', JSON.stringify(currentData));
				}

				return currentData;
			});
		},
		reset: () => {
			if (browser) {
				localStorage.removeItem('trainingData');
			}
			set(null);
		}
	};
}

export const trainingData = createTrainingDataStore();
