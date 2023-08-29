export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			Tests: {
				Row: {
					created_at: string;
					description: string | null;
					id: number;
					questions: number[];
					questions_sum: number;
					type: string;
					user_id: string;
				};
				Insert: {
					created_at: string | Date;
					description?: string | null;
					id?: number;
					questions: number[];
					questions_sum: number;
					type?: string;
					user_id: string;
				};
				Update: {
					created_at?: string | Date;
					description?: string | null;
					id?: number;
					questions?: number[];
					questions_sum?: number;
					type?: string;
					user_id?: string;
				};
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
