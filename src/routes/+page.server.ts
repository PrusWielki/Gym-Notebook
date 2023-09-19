import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (session) throw redirect(301, '/train');
};
