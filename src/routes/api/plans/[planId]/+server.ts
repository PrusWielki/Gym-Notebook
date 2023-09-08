import { json } from '@sveltejs/kit';
import type { PostgrestMaybeSingleResponse } from '@supabase/supabase-js';

type PlansDetailsGetResponse = {
	success: boolean;
	reason: string;
	data: void | PostgrestMaybeSingleResponse<unknown[]>;
};

export async function GET({ locals: { supabase }, params }) {
	const response: PlansDetailsGetResponse = { success: true, reason: '', data: undefined };

	const { data } = await supabase.from('Plans').select(`id, Days ( id ) `).eq('id', params.planId);

	let toReturn: unknown[] = [];
	if (data)
		for (let i = 0; i < data[0].Days.length; i++) {
			await supabase
				.from('Days')
				.select(`id, Exercise_Detail ( sets, target_reps, target_rpe, exercise_type_name ) `)
				.eq('id', data[0].Days[i].id)
				.then((result) => (toReturn = [...toReturn, result.data]));
		}

	if (!response.success) return json({ code: 400, response });

	return json({ code: 200, data: toReturn });
}
