import { getPlans } from '$lib/hooks/get.js';
import { saveThePlan } from '$lib/hooks/post.js';
import { json } from '@sveltejs/kit';
import type { PostgrestMaybeSingleResponse } from '@supabase/supabase-js';

type PlansPostResponse = {
	success: boolean;
	reason: string;
};

type PlansGetResponse = {
	success: boolean;
	reason: string;
	data: void | PostgrestMaybeSingleResponse<unknown[]>;
};

export async function POST({ request, locals: { supabase } }) {
	const { days, planName } = await request.json();
	const response: PlansPostResponse = { success: true, reason: '' };
	await saveThePlan(days, planName, supabase).catch((reason) => {
		response.success = false;
		response.reason = reason;
	});
	if (!response.success) return json({ code: 400, response });
	return json({ code: 200 });
}
export async function GET({ locals: { supabase } }) {
	const response: PlansGetResponse = { success: true, reason: '', data: undefined };
	await getPlans(supabase)
		.catch((reason) => {
			response.success = false;
			response.reason = reason;
		})
		.then((data) => (response.data = data));
	if (!response.success) return json({ code: 400, response });

	return json({ code: 200, data: response.data });
}
