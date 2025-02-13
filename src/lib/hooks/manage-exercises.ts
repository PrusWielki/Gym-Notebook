import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { app } from '$lib/firebase.client';

export type ExerciseDefinition = {
	name: string;
	category?: string;
};

export async function getExercises(): Promise<ExerciseDefinition[]> {
	const db = getFirestore(app);
	const exercisesRef = collection(db, 'exercises');
	const snapshot = await getDocs(exercisesRef);
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ExerciseDefinition);
}

export async function addExercise(exercise: ExerciseDefinition) {
	const db = getFirestore(app);
	const exercisesRef = collection(db, 'exercises');

	// Check if exercise already exists
	const q = query(exercisesRef, where('name', '==', exercise.name));
	const snapshot = await getDocs(q);

	if (!snapshot.empty) {
		throw new Error('Exercise already exists');
	}

	await addDoc(exercisesRef, exercise);
}
