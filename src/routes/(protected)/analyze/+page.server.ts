import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	return {
		allData: await supabase
			.from('Plans')
			.select(
				`id, name, periodization, custom, Weeks (id, order, Days (id, order, name, notes, Exercise_Detail (id, order, sets, target_reps, target_rpe, exercise_type_name, Exercise_Detail_Sets (id, set, reps, rpe, target_reps, target_rpe, weight, creation_date))))`
			),
		exerciseTypes: await supabase.from('Exercise_Types').select()
	};
};
