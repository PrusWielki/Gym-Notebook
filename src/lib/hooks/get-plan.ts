import { db } from '$lib/firebase.client';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface Plan {
	id: string;
	name: string;
	weeks: Array<{ days: Array<{ exercise_name: string; sets: string; reps: string }> }>;
}

/**
 * Get all plans from Firestore.
 * @returns {Plan[] | null} An array of Plan objects, one for each plan in Firestore, or null if there is an error.
 */
export const getPlan = async (
	planName: string,
	currentWeek: string,
	currentDay: string
): Promise<Plan[] | null> => {
	try {
		const plansCollection = collection(db, 'Plans');
		const q = query(plansCollection, where('name', '==', planName));
		const querySnapshot = await getDocs(q);
		const plans = querySnapshot.docs.map(
			(plan) =>
				({
					id: plan.id,
					weeks: plan.data().weeks
				}) as Plan
		);
		return plans;
	} catch (error) {
		console.error(error);
		return null;
	}
};
