export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			Days: {
				Row: {
					id: number;
					name: string;
					notes: string | null;
					order: number;
					week_id: number;
				};
				Insert: {
					id?: number;
					name: string;
					notes?: string | null;
					order?: number;
					week_id: number;
				};
				Update: {
					id?: number;
					name?: string;
					notes?: string | null;
					order?: number;
					week_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Days_week_id_fkey';
						columns: ['week_id'];
						referencedRelation: 'Weeks';
						referencedColumns: ['id'];
					}
				];
			};
			Exercise_Detail: {
				Row: {
					day_id: number;
					exercise_type_name: string;
					id: number;
					order: number;
					sets: number;
					target_reps: string;
					target_rpe: number;
				};
				Insert: {
					day_id: number;
					exercise_type_name: string;
					id?: number;
					order?: number;
					sets: number;
					target_reps: string;
					target_rpe: number;
				};
				Update: {
					day_id?: number;
					exercise_type_name?: string;
					id?: number;
					order?: number;
					sets?: number;
					target_reps?: string;
					target_rpe?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Exercise_Detail_day_id_fkey';
						columns: ['day_id'];
						referencedRelation: 'Days';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Exercise_Detail_exercise_type_name_fkey';
						columns: ['exercise_type_name'];
						referencedRelation: 'Exercise_Types';
						referencedColumns: ['name'];
					}
				];
			};
			Exercise_Detail_Sets: {
				Row: {
					creation_date: string | null;
					exercise_detail_id: number;
					id: number;
					plans_users_id: number;
					reps: number;
					rpe: number;
					set: number;
					target_reps: number;
					target_rpe: number;
					user_id: string | null;
					weight: number;
				};
				Insert: {
					creation_date?: string | null;
					exercise_detail_id: number;
					id?: number;
					plans_users_id: number;
					reps: number;
					rpe: number;
					set: number;
					target_reps: number;
					target_rpe: number;
					user_id?: string | null;
					weight: number;
				};
				Update: {
					creation_date?: string | null;
					exercise_detail_id?: number;
					id?: number;
					plans_users_id?: number;
					reps?: number;
					rpe?: number;
					set?: number;
					target_reps?: number;
					target_rpe?: number;
					user_id?: string | null;
					weight?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Exercise_Detail_Sets_exercise_detail_id_fkey';
						columns: ['exercise_detail_id'];
						referencedRelation: 'Exercise_Detail';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Exercise_Detail_Sets_plans_users_id_fkey';
						columns: ['plans_users_id'];
						referencedRelation: 'Plans_Users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Exercise_Detail_Sets_user_id_fkey';
						columns: ['user_id'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			Exercise_Types: {
				Row: {
					category: string;
					id: number;
					name: string;
				};
				Insert: {
					category?: string;
					id?: number;
					name: string;
				};
				Update: {
					category?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			Periodization: {
				Row: {
					id: number;
					type: string;
				};
				Insert: {
					id?: number;
					type: string;
				};
				Update: {
					id?: number;
					type?: string;
				};
				Relationships: [];
			};
			Plans: {
				Row: {
					custom: boolean;
					id: number;
					name: string;
					periodization: string;
				};
				Insert: {
					custom: boolean;
					id?: number;
					name: string;
					periodization: string;
				};
				Update: {
					custom?: boolean;
					id?: number;
					name?: string;
					periodization?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Plans_periodization_fkey';
						columns: ['periodization'];
						referencedRelation: 'Periodization';
						referencedColumns: ['type'];
					}
				];
			};
			Plans_Users: {
				Row: {
					creation_date: string;
					current_day: number;
					current_week: number;
					id: number;
					modification_date: string;
					plan_id: number;
					user_id: string;
				};
				Insert: {
					creation_date?: string;
					current_day?: number;
					current_week?: number;
					id?: number;
					modification_date?: string;
					plan_id: number;
					user_id?: string;
				};
				Update: {
					creation_date?: string;
					current_day?: number;
					current_week?: number;
					id?: number;
					modification_date?: string;
					plan_id?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Plans_Users_plan_id_fkey';
						columns: ['plan_id'];
						referencedRelation: 'Plans';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Plans_Users_user_id_fkey';
						columns: ['user_id'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			Weeks: {
				Row: {
					id: number;
					order: number;
					plan_id: number;
				};
				Insert: {
					id?: number;
					order: number;
					plan_id: number;
				};
				Update: {
					id?: number;
					order?: number;
					plan_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Weeks_plan_id_fkey';
						columns: ['plan_id'];
						referencedRelation: 'Plans';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
