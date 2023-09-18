import { error, json } from '@sveltejs/kit';

export type ExerciseDetailPostRequest = {
	exerciseDetailSets: Array<App.ExerciseDetailSet>;
};
export async function POST({ request, locals: { supabase } }) {
	const { exerciseDetailSets, plansUsersId, newCurrentWeek, newCurrentDay } = await request.json();

	const { error: insertError } = await supabase
		.from('Exercise_Detail_Sets')
		.insert(exerciseDetailSets);

	if (insertError) throw error(400, insertError.message);
	const { error: updateError } = await supabase
		.from('Plans_Users')
		.update({ current_week: newCurrentWeek, current_day: newCurrentDay })
		.eq('id', plansUsersId);
	if (updateError) throw error(400, updateError.message);
	return json({ code: 200 });
}
