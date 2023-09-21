import type { SupabaseClient } from '@supabase/supabase-js';
import { validateData } from './validators';

export const updateThePlan = async (
	weeks: Array<App.Week>,
	planName: string,
	supabase: SupabaseClient,
	custom: boolean,
	periodization: string,
	planId: string
) => {
	const validationResult = validateData(weeks, planName, periodization, custom);
	if (validationResult.result !== true) throw new Error(validationResult.message);

	const { error, data: result } = await supabase
		.from('Plans')
		.upsert({ id: planId, name: planName, custom, periodization })
		.select();
	if (error) throw new Error('Query Error');
	weeks.forEach(async (week) => {
		if (week) {
			const { error, data: weekId } = await supabase
				.from('Weeks')
				.upsert({ id: week.id, order: week.order, plan_id: result[0].id })
				.select();

			if (error) throw new Error('Query Error');

			week.Days.forEach(async (day) => {
				if (day) {
					const { error, data: dayId } = await supabase
						.from('Days')
						.update({
							id: day.id,
							name: day.name,
							order: day.order,
							notes: day.notes,
							week_id: weekId[0].id
						})
						.select();
					if (error) throw new Error('Query Error');

					day.Exercise_Detail.forEach(async (exercise) => {
						if (
							exercise.exercise_type_name &&
							exercise.sets &&
							exercise.target_reps &&
							exercise.target_rpe
						) {
							const { error } = await supabase.from('Exercise_Detail').upsert({
								id: exercise.id,
								exercise_type_name: exercise.exercise_type_name,
								order: exercise.order,
								sets: exercise.sets,
								target_reps: exercise.target_reps,
								target_rpe: exercise.target_rpe,
								day_id: dayId[0].id
							});
							if (error) throw new Error('Query Error');
						}
					});
				}
			});
		}
	});
};
