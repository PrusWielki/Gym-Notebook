import { db } from '$lib/firebase.client';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface Plan {
	id: string;
	name: string;
	weeks: Array<{
		days: Array<{
			exercises: Array<{
				exercise_name: string;
				sets: string;
				reps: string;
				rpe: string;
				weight: string;
				notes: string;
			}>;
		}>;
	}>;
}

/**
 * Get a plan from Firestore.
 * @returns {Plan | null} A plan object, one for each plan in Firestore, or null if there is an error.
 */
export const getPlan = async (planName: string): Promise<Plan | null> => {
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
		return plans[0];
	} catch (error) {
		console.error(error);
		return null;
	}
};
