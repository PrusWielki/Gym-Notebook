import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data, error } = await supabase.from('Plans_Users').select().eq('current', true);

	if (error) return;

	return {
		plan: data
	};
};
