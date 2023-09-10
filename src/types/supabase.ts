export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			Days: {
				Row: {
					id: number;
					name: string;
					week_id: number;
				};
				Insert: {
					id?: number;
					name: string;
					week_id: number;
				};
				Update: {
					id?: number;
					name?: string;
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
					sets: number;
					target_reps: string;
					target_rpe: number;
				};
				Insert: {
					day_id: number;
					exercise_type_name: string;
					id?: number;
					sets: number;
					target_reps: string;
					target_rpe: number;
				};
				Update: {
					day_id?: number;
					exercise_type_name?: string;
					id?: number;
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
					exercise_detail: number;
					id: number;
					reps: number;
					rpe: number;
					set: number;
					target_reps: number;
					target_rpe: number;
				};
				Insert: {
					exercise_detail: number;
					id?: number;
					reps: number;
					rpe: number;
					set: number;
					target_reps: number;
					target_rpe: number;
				};
				Update: {
					exercise_detail?: number;
					id?: number;
					reps?: number;
					rpe?: number;
					set?: number;
					target_reps?: number;
					target_rpe?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Exercise_Detail_Sets_exercise_detail_fkey';
						columns: ['exercise_detail'];
						referencedRelation: 'Exercise_Detail';
						referencedColumns: ['id'];
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
					periodization_id: number;
				};
				Insert: {
					custom: boolean;
					id?: number;
					name: string;
					periodization_id: number;
				};
				Update: {
					custom?: boolean;
					id?: number;
					name?: string;
					periodization_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Plans_periodization_id_fkey';
						columns: ['periodization_id'];
						referencedRelation: 'Periodization';
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
