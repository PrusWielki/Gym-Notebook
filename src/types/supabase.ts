export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			Days: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			Days_Exercises: {
				Row: {
					day_id: number;
					exercise_detail_id: number;
					id: number;
				};
				Insert: {
					day_id: number;
					exercise_detail_id: number;
					id?: number;
				};
				Update: {
					day_id?: number;
					exercise_detail_id?: number;
					id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Days_Exercises_day_id_fkey';
						columns: ['day_id'];
						referencedRelation: 'Days';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Days_Exercises_exercise_detail_id_fkey';
						columns: ['exercise_detail_id'];
						referencedRelation: 'Exercise_Detail';
						referencedColumns: ['id'];
					}
				];
			};
			Exercise_Detail: {
				Row: {
					exercise_type_name: string;
					id: number;
					sets: number;
					target_reps: string;
					target_rpe: number;
				};
				Insert: {
					exercise_type_name: string;
					id?: number;
					sets: number;
					target_reps: string;
					target_rpe: number;
				};
				Update: {
					exercise_type_name?: string;
					id?: number;
					sets?: number;
					target_reps?: string;
					target_rpe?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Exercise_Detail_exercise_type_name_fkey';
						columns: ['exercise_type_name'];
						referencedRelation: 'Exercise_Types';
						referencedColumns: ['name'];
					}
				];
			};
			Exercise_Types: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			Exercises: {
				Row: {
					created_at: string;
					day: number;
					detail: number;
					id: number;
					name: string;
					plan: number;
					reps: number[];
					rpe: number;
					target_reps: number[];
				};
				Insert: {
					created_at?: string;
					day: number;
					detail: number;
					id?: number;
					name: string;
					plan: number;
					reps: number[];
					rpe: number;
					target_reps: number[];
				};
				Update: {
					created_at?: string;
					day?: number;
					detail?: number;
					id?: number;
					name?: string;
					plan?: number;
					reps?: number[];
					rpe?: number;
					target_reps?: number[];
				};
				Relationships: [
					{
						foreignKeyName: 'Exercises_day_fkey';
						columns: ['day'];
						referencedRelation: 'Days';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Exercises_detail_fkey';
						columns: ['detail'];
						referencedRelation: 'Exercise_Detail';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Exercises_plan_fkey';
						columns: ['plan'];
						referencedRelation: 'Plans';
						referencedColumns: ['id'];
					}
				];
			};
			Plans: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			Plans_Days: {
				Row: {
					day_id: number;
					id: number;
					plan_id: number;
				};
				Insert: {
					day_id: number;
					id?: number;
					plan_id: number;
				};
				Update: {
					day_id?: number;
					id?: number;
					plan_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Plans_Days_day_id_fkey';
						columns: ['day_id'];
						referencedRelation: 'Days';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Plans_Days_plan_id_fkey';
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
