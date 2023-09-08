import type { SupabaseClient } from '@supabase/supabase-js';
export const saveThePlan = async (
	days: Array<
		Array<{
			exercise_type_name: string | null;
			sets: number | null;
			target_reps: string | null;
			target_rpe: number | null;
		}>
	>,
	planName: string,
	supabase: SupabaseClient
) => {
	const { data: result } = await supabase.from('Plans').insert({ name: planName }).select();

	days.forEach(async (day, index) => {
		const { data: dayId } = await supabase
			.from('Days')
			.insert({ name: `${planName}_${index}` })
			.select();
		if (dayId && result)
			await supabase
				.from('Plans_Days')
				.insert({ day_id: dayId[0].id, plan_id: result[0].id })
				.select();

		day.forEach(async (exercise) => {
			if (
				exercise.exercise_type_name &&
				exercise.sets &&
				exercise.target_reps &&
				exercise.target_rpe
			) {
				const { data: exerciseResult } = await supabase
					.from('Exercise_Detail')
					.insert({
						exercise_type_name: exercise.exercise_type_name,
						sets: exercise.sets,
						target_reps: exercise.target_reps,
						target_rpe: exercise.target_rpe
					})
					.select();
				if (dayId && exerciseResult)
					await supabase
						.from('Days_Exercises')
						.insert({ day_id: dayId[0].id, exercise_detail_id: exerciseResult[0].id })
						.select();
			}
		});
	});
};
