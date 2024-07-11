import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: planName, error } = await supabase
		.from('Plans_Users')
		.select()
		.order('modification_date', { ascending: false })
		.limit(1);
	let planData = null;
	let planError = null;
	if (planName) {
		const { error, data } = await supabase
			.from('Plans')
			.select(
				`id, name, periodization, custom, Weeks (id, order, Days (id, order, name, notes, Exercise_Detail (id, order, sets, target_reps, target_rpe, exercise_type_name, Exercise_Detail_Sets (id, set, reps, rpe, target_reps, target_rpe))))`
			)
			.eq('id', planName[0].plan_id)
			.order('order', { referencedTable: 'Weeks' })
			.order('order', { referencedTable: 'Weeks.Days' })
			.order('order', { referencedTable: 'Weeks.Days.Exercise_Detail' });
		planData = data;
		planError = error;
	}
	if (error && planError) return;

	return {
		planData: planData,
		planName: planName
	};
};
