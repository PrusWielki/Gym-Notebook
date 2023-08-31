import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types.js';

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session) {
		// the user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}
};
