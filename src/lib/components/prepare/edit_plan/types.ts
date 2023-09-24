export type UpdatePlan = {
	code: number;
	data:
		| {
				id: number;
				name: string;
				periodization: string;
				custom: boolean;
				Weeks: {
					id: number | null;
					order: number;
					Days: {
						id: number | null;
						name: string;
						notes: string | null;
						order: number;
						Exercise_Detail: {
							id: string | null;
							order: number;
							sets: number | null;
							target_reps: string | null;
							target_rpe: number | null;
							exercise_type_name: string | null;
							Exercise_Detail_Sets:
								| {
										id: number;
										set: number;
										reps: number;
										rpe: number;
										target_reps: number;
										target_rpe: number;
										weight: number;
								  }[]
								| null;
						}[];
					}[];
				}[];
		  }[]
		| null;
};
