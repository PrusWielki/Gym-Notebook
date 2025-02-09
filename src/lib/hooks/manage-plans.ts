import {
	getFirestore,
	collection,
	doc,
	setDoc,
	updateDoc,
	getDoc,
	getDocs
} from 'firebase/firestore';
import { app, auth } from '$lib/firebase.client';

export type Exercise = {
	exercise_name: string;
	sets: string;
	reps: string;
	rpe: string;
	weight: string;
	notes: string;
};

export type Plan = {
	id?: string;
	name: string;
	authorId: string;
	isPredefined?: boolean;
	weeks: {
		days: {
			exercises: Exercise[];
		}[];
	}[];
};

export async function savePlan(plan: Plan) {
	const currentUserId = auth.currentUser?.uid;
	if (!currentUserId) throw new Error('No user logged in');

	const db = getFirestore(app);
	const planRef = doc(collection(db, 'users', currentUserId, 'plans'));

	await setDoc(planRef, {
		...plan,
		createdAt: new Date(),
		updatedAt: new Date()
	});

	return planRef.id;
}

export async function updatePlan(planId: string, plan: Partial<Plan>) {
	const currentUserId = auth.currentUser?.uid;
	if (!currentUserId) throw new Error('No user logged in');

	const db = getFirestore(app);
	const planRef = doc(db, 'users', currentUserId, 'plans', planId);

	await updateDoc(planRef, {
		...plan,
		updatedAt: new Date()
	});
}

export async function saveTrainingLog(
	planId: string,
	week: number,
	day: number,
	exercises: Record<
		string,
		Array<{
			sets: number;
			reps: number;
			rpe: number;
			weight: number;
		}>
	>
) {
	const currentUserId = auth.currentUser?.uid;
	if (!currentUserId) throw new Error('No user logged in');

	const db = getFirestore(app);
	const logsRef = collection(db, 'users', currentUserId, 'exercise_logs');

	const date = new Date();

	// Create a log entry for each exercise
	const savePromises = Object.entries(exercises).map(([exerciseName, sets]) => {
		sets.forEach((set) => {
			const logRef = doc(logsRef);
			return setDoc(logRef, {
				exercise_name: exerciseName,
				...set,
				planId,
				week,
				day,
				date
			});
		});
	});

	await Promise.all(savePromises.flat());
}

export async function getPlan(planId: string) {
	const currentUserId = auth.currentUser?.uid;
	if (!currentUserId) return null;

	const db = getFirestore(app);
	const planRef = doc(db, 'users', currentUserId, 'plans', planId);
	const planDoc = await getDoc(planRef);

	return planDoc.exists() ? (planDoc.data() as Plan) : null;
}

export async function getPlans() {
	const currentUserId = auth.currentUser?.uid;
	if (!currentUserId) return [];

	const db = getFirestore(app);
	const plansRef = collection(db, 'users', currentUserId, 'plans');
	const plansSnapshot = await getDocs(plansRef);

	return plansSnapshot.docs.map(
		(doc) =>
			({
				id: doc.id,
				...doc.data()
			}) as Plan & { id: string }
	);
}

export async function getPredefinedPlans() {
	const db = getFirestore(app);
	const plansRef = collection(db, 'predefined_plans');
	const plansSnapshot = await getDocs(plansRef);

	return plansSnapshot.docs.map(
		(doc) =>
			({
				id: doc.id,
				...doc.data()
			}) as Plan
	);
}
