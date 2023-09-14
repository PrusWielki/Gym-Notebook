import { error, json } from '@sveltejs/kit';

export type ExerciseDetailPostRequest = {
	exerciseDetailSets: Array<App.ExerciseDetailSet>;
};
export async function POST({ request, locals: { supabase } }) {
	const { exerciseDetailSets } = await request.json();

	const { error: insertError } = await supabase
		.from('Exercise_Detail_Sets')
		.insert(exerciseDetailSets);

	if (insertError) throw error(400, insertError.message);
	else return json({ code: 200 });
}
