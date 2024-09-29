import { auth, db } from '$lib/firebase.client';
import { doc, getDoc } from 'firebase/firestore';

export type UserData = {
	currentPlan: string;
	currentWeek: string;
	currentDay: string;
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
