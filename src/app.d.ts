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
			name: string | null;
			notes: string | null;
			Exercise_Detail: {
				id: string | null;
				sets: number | null;
				target_reps: string | null;
				target_rpe: number | null;
				exercise_type_name: string | null;
				Exercise_Detail_Sets:
					| {
							set: number;
							reps: number;
							rpe: number;
							target_reps: number;
							target_rpe: number;
					  }[]
					| null;
			}[];
		};
		type Week = {
			order: number;
			Days: Array<TrainingDay>;
		} | null;

		type Plans = Array<{
			name: string;
		}> | null;

		type ExerciseDetailSet = {
			set: number;
			reps: number;
			rpe: number;
			exercise_detail_id: string;
			target_reps: number;
			target_rpe: number;
			plans_users_id: string;
			weight: number;
		};

		// interface Error {}
		// interface Platform {}
	}
}
export {};
