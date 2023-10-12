import { json } from '@sveltejs/kit';

export async function GET({ locals: { supabase }, params }) {
	const { error, data } = await supabase
		.from('Plans')
		.select(
			`id, name, periodization, custom, Weeks (id, order, Days (id, order, name, notes, Exercise_Detail (id, order, sets, target_reps, target_rpe, exercise_type_name, Exercise_Detail_Sets (id, set, reps, rpe, target_reps, target_rpe, weight, creation_date))))`
		);
	//.eq('Weeks.Days.Exercise_Detail.exercise_type_name', params.exerciseType);
	if (error) return json({ code: 400, error });

	return json({ code: 200, data });
}
