import { json } from '@sveltejs/kit';

export async function GET({ locals: { supabase }, params }) {
	const { error, data } = await supabase
		.from('Plans_Users')
		.select()
		.eq('plan_id', params.planId)
		.eq('current', true);

	if (error) return json({ code: 400, error });

	return json({ code: 200, data });
}
