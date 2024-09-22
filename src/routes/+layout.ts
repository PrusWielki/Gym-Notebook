/** @type {import('./$types').LayoutLoad} */

import { initializeFirebase, auth } from '$lib/firebase.client';
import { browser } from '$app/environment';
import { connectAuthEmulator, onAuthStateChanged } from 'firebase/auth';

export async function load({ url }) {
	if (browser) {
		try {
			initializeFirebase();
		} catch (ex) {
			console.error(ex);
		}
		if (location.hostname === "localhost"||location.hostname === "127.0.0.1") {
			connectAuthEmulator(auth, "http://127.0.0.1:9099");
		}
	}


	function getAuthUser() {
		return new Promise((resolve) => {
			onAuthStateChanged(auth, (user) => resolve(user ? user : false));
		});
	}

	return {
		getAuthUser: getAuthUser,
		url: url.pathname
	};
}
