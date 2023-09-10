import type { SupabaseClient } from '@supabase/supabase-js';

const validateData = (
	weeks: Array<App.Week>,
	planName: string,
	periodization: string,
	custom: boolean
) => {
	let result: { result: boolean; message: string } = { result: true, message: '' };
	if (!planName) return { result: false, message: 'Plan Name is empty!' };
	if (custom === null || custom === undefined)
		return { result: false, message: 'custom is empty!' };
	if (!periodization) return { result: false, message: 'periodization is empty!' };
	weeks.forEach((week, index) => {
		if (week) week.order = index + 1;
	});
	weeks.forEach((week) => {
		week?.Days.forEach((day) => {
			if (!day.name) return { result: false, message: 'Day name is empty!' };
			day.Exercise_Detail.forEach((exercise) => {
				if (
					!exercise.exercise_type_name ||
					!exercise.sets ||
					!exercise.target_reps ||
					!exercise.target_rpe
				)
					result = { result: false, message: 'Make sure to fill all the fields :)' };
			});
		});
	});
	return result;
};

export const saveThePlan = async (
	weeks: Array<App.Week>,
	planName: string,
	supabase: SupabaseClient,
	custom: boolean,
	periodization: string
) => {
	try {
		const validationResult = validateData(weeks, planName, periodization, custom);
		if (validationResult.result !== true) throw validationResult.message;

		const { error, data: result } = await supabase
			.from('Plans')
			.insert({ name: planName, custom, periodization })
			.select();
		if (error) throw error;
		weeks.forEach(async (week) => {
			if (week) {
				try {
					const { error, data: weekId } = await supabase
						.from('Weeks')
						.insert({ order: week.order, plan_id: result[0].id })
						.select();

					if (error) throw error;

					week.Days.forEach(async (day) => {
						if (day) {
							try {
								const { error, data: dayId } = await supabase
									.from('Days')
									.insert({ name: day.name, notes: day.notes, week_id: weekId[0].id })
									.select();
								if (error) throw error;

								day.Exercise_Detail.forEach(async (exercise) => {
									if (
										exercise.exercise_type_name &&
										exercise.sets &&
										exercise.target_reps &&
										exercise.target_rpe
									) {
										try {
											const { error } = await supabase.from('Exercise_Detail').insert({
												exercise_type_name: exercise.exercise_type_name,
												sets: exercise.sets,
												target_reps: exercise.target_reps,
												target_rpe: exercise.target_rpe,
												day_id: dayId[0].id
											});
											if (error) throw error;
										} catch (error) {
											console.log(error);
										}
									}
								});
							} catch {
								console.log(error);
							}
						}
					});
				} catch {
					console.log(error);
				}
			}
		});
	} catch (error) {
		console.log(error);
	}
};
