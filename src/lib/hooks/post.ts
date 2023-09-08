import type { SupabaseClient } from '@supabase/supabase-js';

const validateData = (days: App.TrainingDays, planName: string) => {
	let result: { result: boolean; message: string } = { result: true, message: '' };
	if (!planName) return { result: false, message: 'Plan Name is empty!' };

	days.forEach((day) => {
		day.forEach((exercise) => {
			if (
				!exercise.exercise_type_name ||
				!exercise.sets ||
				!exercise.target_reps ||
				!exercise.target_rpe
			)
				result = { result: false, message: 'Make sure to fill all the fields :)' };
		});
	});
	return result;
};

export const saveThePlan = async (
	days: App.TrainingDays,
	planName: string,
	supabase: SupabaseClient
) => {
	const validationResult = validateData(days, planName);
	if (validationResult.result !== true) throw validationResult.message;
	const { error, data: result } = await supabase.from('Plans').insert({ name: planName }).select();
	if (error) throw error;
	days.forEach(async (day, index) => {
		const { error, data: dayId } = await supabase
			.from('Days')
			.insert({ name: `${planName}_${index}` })
			.select();
		if (error) throw error;
		if (dayId && result)
			await supabase.from('Plans_Days').insert({ day_id: dayId[0].id, plan_id: result[0].id });

		day.forEach(async (exercise) => {
			if (
				exercise.exercise_type_name &&
				exercise.sets &&
				exercise.target_reps &&
				exercise.target_rpe
			) {
				const { error, data: exerciseResult } = await supabase
					.from('Exercise_Detail')
					.insert({
						exercise_type_name: exercise.exercise_type_name,
						sets: exercise.sets,
						target_reps: exercise.target_reps,
						target_rpe: exercise.target_rpe
					})
					.select();
				if (error) throw error;
				if (dayId && exerciseResult)
					await supabase
						.from('Days_Exercises')
						.insert({ day_id: dayId[0].id, exercise_detail_id: exerciseResult[0].id })
						.select();
			}
		});
	});
};
