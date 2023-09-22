import { getPlansAuthor } from '$lib/query/get.js';
import { error, json } from '@sveltejs/kit';
import type { PostgrestMaybeSingleResponse } from '@supabase/supabase-js';
import { updateThePlan } from '$lib/query/update.js';
import { deletePlanElementsAfterUpdate } from '$lib/query/delete.js';

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
	const { weeks, planName, custom, periodization, planId, toRemove } = await request.json();
	const response: PlansPostResponse = { success: true, reason: '' };
	await updateThePlan(weeks, planName, supabase, custom, periodization, planId).catch((reason) => {
		response.success = false;
		response.reason = reason;
	});
	await deletePlanElementsAfterUpdate(toRemove, supabase).catch((reason) => {
		response.success = false;
		response.reason = reason;
	});

	if (!response.success) throw error(400, response.reason);
	else return json({ code: 200 });
}
export async function GET({ locals: { supabase, getSession } }) {
	const response: PlansGetResponse = { success: true, reason: '', data: undefined };
	const session = await getSession();
	await getPlansAuthor(supabase, session)
		.catch((reason) => {
			response.success = false;
			response.reason = reason;
		})
		.then((data) => (response.data = data));

	if (!response.success) return json({ code: 400, response });

	return json({ code: 200, data: response.data });
}
