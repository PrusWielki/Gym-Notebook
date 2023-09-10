import { json } from '@sveltejs/kit';

export type GetPlansResponse = {
	code: number;
	data:
		| {
				id: number;
				name: string;
				periodization: string;
				custom: boolean;
				Weeks: {
					id: number;
					order: number;
					Days: {
						id: number;
						name: string;
						notes: string;
						Exercise_Detail: {
							id: number;
							sets: number;
							target_reps: string;
							target_rpe: number;
							exercise_type_name: string;
							Exercise_Detail_Sets: {
								id: number;
								set: number;
								reps: number;
								rpe: number;
								target_reps: number;
								target_rpe: number;
							}[];
						}[];
					}[];
				}[];
		  }[]
		| null;
};

export async function GET({ locals: { supabase }, params }) {
	const { error, data } = await supabase
		.from('Plans')
		.select(
			`id, name, periodization, custom, Weeks (id, order, Days (id, name, notes, Exercise_Detail (id, sets, target_reps, target_rpe, exercise_type_name, Exercise_Detail_Sets (id, set, reps, rpe, target_reps, target_rpe))))`
		)
		.eq('id', params.planId);

	if (error) return json({ code: 400, error });

	return json({ code: 200, data });
}
