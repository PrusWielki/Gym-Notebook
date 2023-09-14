import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data, error } = await supabase
		.from('Plans_Users')
		.select()
		.order('modification_date', { ascending: false });

	if (error) return;

	return {
		plan: data[0]
	};
};
