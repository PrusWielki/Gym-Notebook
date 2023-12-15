import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { validateData } from './validators';
import { error } from '@sveltejs/kit';

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
	const erred: Array<PostgrestError> = [];
	const { error: upsertError, data: result } = await supabase
		.from('Plans')
		.upsert({ id: planId, name: planName, custom, periodization })
		.select();
	if (upsertError) error(400, upsertError);

	weeks.forEach(async (week) => {
		if (week) {
			const { error: upsertError, data: weekId } = await supabase
				.from('Weeks')
				.upsert({ ...(week.id && { id: week.id }), order: week.order, plan_id: result[0].id })
				.select();

			if (upsertError) erred.push(upsertError);
			else {
				week.Days.forEach(async (day) => {
					if (day) {
						const { error: upsertError, data: dayId } = await supabase
							.from('Days')
							.upsert({
								...(day.id && { id: day.id }),
								name: day.name,
								order: day.order,
								notes: day.notes,
								week_id: weekId[0].id
							})
							.select();

						if (upsertError) erred.push(upsertError);
						else {
							day.Exercise_Detail.forEach(async (exercise) => {
								if (
									exercise.exercise_type_name &&
									exercise.sets &&
									exercise.target_reps &&
									exercise.target_rpe
								) {
									const { error: upsertError } = await supabase.from('Exercise_Detail').upsert({
										...(exercise.id && { id: exercise.id }),
										exercise_type_name: exercise.exercise_type_name,
										order: exercise.order,
										sets: exercise.sets,
										target_reps: exercise.target_reps,
										target_rpe: exercise.target_rpe,
										day_id: dayId[0].id
									});

									if (upsertError) erred.push(upsertError);
								}
							});
						}
					}
				});
			}
		}
	});
	if (erred.length > 0) {
		throw erred[0];
	}
};
