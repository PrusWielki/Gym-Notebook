import type { SupabaseClient } from '@supabase/supabase-js';
export const getPlans = async (supabase: SupabaseClient) => {
	return await supabase.from('Plans').select();
};
/*  export const getPlanDetails =  async (supabase: SupabaseClient) => {



 } */
