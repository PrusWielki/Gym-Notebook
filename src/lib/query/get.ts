import type { Session, SupabaseClient } from '@supabase/supabase-js';
export const getPlans = async (supabase: SupabaseClient) => {
	return await supabase.from('Plans').select();
};
export const getPlansAuthor = async (supabase: SupabaseClient, session: Session | null) => {
	if (session) return await supabase.from('Plans').select().eq('created_by', session.user.id);
};
