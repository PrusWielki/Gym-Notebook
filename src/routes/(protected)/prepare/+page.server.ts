import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data } = await supabase.from('Exercise_Types').select().range(0, 10);

	return { exercises: data };
};
