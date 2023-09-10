import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	return {
		exercises: await supabase.from('Exercise_Types').select(),
		plans: await supabase.from('Plans').select(),
		periodizations: await supabase.from('Periodization').select()
	};
};
