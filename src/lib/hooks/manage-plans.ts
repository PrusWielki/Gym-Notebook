import {
	getFirestore,
	collection,
	doc,
	setDoc,
	updateDoc,
	getDoc,
	getDocs,
	getDocsFromCache,
	getDocsFromServer
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

	// Create a log entry for each exercise and set
	const savePromises = Object.entries(exercises).flatMap(([exerciseName, sets]) =>
		sets.map((set) =>
			setDoc(doc(logsRef), {
				exercise_name: exerciseName,
				reps: set.reps,
				sets: set.sets,
				rpe: set.rpe,
				weight: set.weight,
				planId,
				week,
				day,
				date
			})
		)
	);

	await Promise.all(savePromises);
}

export async function getPlan(planId: string) {
	const currentUserId = auth.currentUser?.uid;
	if (!currentUserId) return null;

	const db = getFirestore(app);
	const planRef = doc(db, 'users', currentUserId, 'plans', planId);
	const planDoc = await getDoc(planRef);

	return planDoc.exists() ? (planDoc.data() as Plan) : null;
}

export async function getPlans(): Promise<Plan[]> {
	try {
		const currentUserId = auth.currentUser?.uid;
		if (!currentUserId) return [];

		const db = getFirestore(app);
		const plansRef = collection(db, 'users', currentUserId, 'plans');

		// Try cache first
		try {
			const snapshot = await getDocsFromCache(plansRef);
			if (!snapshot.empty) {
				return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Plan);
			}
		} catch (error) {
			console.log('No cached data available');
		}

		// If cache fails or is empty, get from server
		const snapshot = await getDocsFromServer(plansRef);
		return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Plan);
	} catch (error) {
		console.error('Error fetching plans:', error);
		throw error;
	}
}

export async function getPredefinedPlans(): Promise<Plan[]> {
	try {
		const db = getFirestore(app);
		const plansRef = collection(db, 'predefined_plans');

		// Try cache first
		try {
			const snapshot = await getDocsFromCache(plansRef);
			if (!snapshot.empty) {
				return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Plan);
			}
		} catch (error) {
			console.log('No cached data available');
		}

		// If cache fails or is empty, get from server
		const snapshot = await getDocsFromServer(plansRef);
		return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Plan);
	} catch (error) {
		console.error('Error fetching predefined plans:', error);
		throw error;
	}
}
