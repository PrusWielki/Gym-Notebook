import { getPlans } from '$lib/query/get.js';
import { saveThePlan } from '$lib/query/post.js';
import { error, json } from '@sveltejs/kit';
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

export type PlansPostRequest = {
	weeks: Array<App.Week>;
	planName: string;
	custom: boolean;
	periodization: string;
};
export async function POST({ request, locals: { supabase } }) {
	const { weeks, planName, custom, periodization } = await request.json();
	const response: PlansPostResponse = { success: true, reason: '' };
	await saveThePlan(weeks, planName, supabase, custom, periodization).catch((reason) => {
		response.success = false;
		response.reason = reason.message;
	});
	if (!response.success) throw error(400, response.reason);
	else return json({ code: 200 });
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
