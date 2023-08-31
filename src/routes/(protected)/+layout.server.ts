import { error } from '@sveltejs/kit';

export const load = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session) {
		// the user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}
};
