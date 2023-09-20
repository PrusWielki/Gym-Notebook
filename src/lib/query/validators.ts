export const validateData = (
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
