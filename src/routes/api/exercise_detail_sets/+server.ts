import { error, json } from '@sveltejs/kit';

export type ExerciseDetailPostRequest = {
	exerciseDetailSets: Array<App.ExerciseDetailSet>;
};
export async function POST({ request, locals: { supabase } }) {
	const { exerciseDetailSets, plansUsersId, newCurrentWeek, newCurrentDay } = await request.json();
	const { error: insertError } = await supabase
		.from('Exercise_Detail_Sets')
		.insert(exerciseDetailSets);
	if (insertError) error(400, insertError.message);
	const { error: updateError } = await supabase
		.from('Plans_Users')
		.update({ current_week: newCurrentWeek, current_day: newCurrentDay })
		.eq('id', plansUsersId);
	if (updateError) error(400, updateError.message);
	return json({ code: 200 });
}

export async function GET({ locals: { supabase } }) {
	const { error, data } = await supabase
		.from('Plans')
		.select(
			`id, name, periodization, custom, Weeks (id, order, Days (id, order, name, notes, Exercise_Detail (id, order, sets, target_reps, target_rpe, exercise_type_name, Exercise_Detail_Sets (id, set, reps, rpe, target_reps, target_rpe))))`
		)
		.order('order', { foreignTable: 'Weeks' })
		.order('order', { foreignTable: 'Weeks.Days' })
		.order('order', { foreignTable: 'Weeks.Days.Exercise_Detail' });
	if (error) return json({ code: 400, error });

	return json({ code: 200, data });
}
