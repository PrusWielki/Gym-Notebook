import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './DatabaseDefinitions';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		type TrainingDay = {
			name: string;
			Exercise_Detail: Array<{
				exercise_type_name: string | null;
				sets: number | null;
				target_reps: string | null;
				target_rpe: number | null;
			}>;
		};
		type TrainingDays = Array<TrainingDay>;

		type Plans = Array<{
			name: string;
		}> | null;

		// interface Error {}
		// interface Platform {}
	}
}
export {};
