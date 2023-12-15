import { error, json } from '@sveltejs/kit';

export async function GET({ locals: { supabase }, params }) {
	const { error, data } = await supabase
		.from('Plans_Users')
		.select()
		.eq('plan_id', params.planId)
		.eq('current', true);

	if (error) return json({ code: 400, error });

	return json({ code: 200, data });
}
export async function POST({ locals: { supabase }, params }) {
	const { planId } = params;
	const { error: insertError } = await supabase.from('Plans_Users').insert({ plan_id: planId });

	if (insertError) error(400, insertError.message);
	return json({ code: 200 });
}
