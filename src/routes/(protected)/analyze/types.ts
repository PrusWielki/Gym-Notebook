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
export type ExtractedExercises = Array<{
	creation_date: string;
	exercise_type_name: string;
	reps: number;
	rpe: number;
	weight: number;
}>;
