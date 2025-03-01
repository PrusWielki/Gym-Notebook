import {
	doc,
	getDoc,
	getDocFromCache,
	getDocFromServer,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import { db, auth } from '$lib/firebase.client';
import { getFirestore } from 'firebase/firestore';
import { app } from '$lib/firebase.client';

export type UserData = {
	currentPlan: string;
	currentWeek: number;
	currentDay: number;
	selectedPlan?: {
		id: string;
		type: 'user' | 'predefined';
	};
};

/**
 * Get the user data from Firestore, or null if the user is not logged in
 * or if the user document does not exist.
 *
 * @returns {UserData | null} The user data, or null if the user is not logged in
 * or if the user document does not exist.
 */
export async function getUserData(): Promise<UserData | null> {
	const currentUser = auth.currentUser;
	if (!currentUser) return null;

	const userRef = doc(db, 'UserData', currentUser.uid);

	try {
		// Try cache first
		try {
			const snapshot = await getDocFromCache(userRef);
			if (snapshot.exists()) {
				return snapshot.data() as UserData;
			}
		} catch (error) {
			console.log('No cached user data available');
		}

		// If cache fails or is empty, get from server
		const snapshot = await getDocFromServer(userRef);
		if (snapshot.exists()) {
			return snapshot.data() as UserData;
		}

		return null;
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
}

export async function updateUserData(data: Partial<UserData>) {
	const currentUserId = auth.currentUser?.uid;
	if (!currentUserId) return;

	const db = getFirestore(app);
	const userRef = doc(db, 'UserData', currentUserId);

	try {
		const docSnap = await getDoc(userRef);
		if (!docSnap.exists()) {
			await setDoc(userRef, data);
		} else {
			await updateDoc(userRef, data);
		}
	} catch (error) {
		console.error('Error updating user data:', error);
		throw error;
	}
}
