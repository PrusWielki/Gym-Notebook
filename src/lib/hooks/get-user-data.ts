import { auth, db } from '$lib/firebase.client';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
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
export const getUserData = async (): Promise<UserData | null> => {
	let userData: UserData | null = null;
	try {
		const currentUserId = auth.currentUser?.uid;
		if (currentUserId) {
			const userDocumentRef = doc(db, 'UserData', currentUserId?.toString());
			const userDocumentSnap = await getDoc(userDocumentRef);
			if (userDocumentSnap.exists()) {
				userData = userDocumentSnap.data() as UserData;
			}
		}
	} catch (error) {
		console.error(error);
	}
	return userData;
};

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
