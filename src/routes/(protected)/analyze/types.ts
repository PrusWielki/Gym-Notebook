export type Exercises = Array<{
	Weeks: Array<{
		Days: Array<{
			Exercise_Detail: Array<{
				exercise_type_name: string;
				Exercise_Detail_Sets: Array<{
					creation_date: string;
					reps: number;
					rpe: number;
					weight: number;
				}>;
			}>;
		}>;
	}>;
}>;
