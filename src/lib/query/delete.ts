import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export const deletePlanElementsAfterUpdate = async (
	toRemove: Array<{ type: 'Day' | 'Week' | 'Exercise_Detail'; id: number }>,
	supabase: SupabaseClient
) => {
	const erred: Array<PostgrestError> = [];
	toRemove.forEach(async (element) => {
		switch (element.type) {
			case 'Day':
				// eslint-disable-next-line no-case-declarations
				const { error: daysError } = await supabase.from('Days').delete().eq('id', element.id);
				if (daysError) erred.push(daysError);
				break;
			case 'Exercise_Detail':
				// eslint-disable-next-line no-case-declarations
				const { error: exercisesError } = await supabase
					.from('Exercise_Detail')
					.delete()
					.eq('id', element.id);
				if (exercisesError) erred.push(exercisesError);
				break;
			case 'Week':
				// eslint-disable-next-line no-case-declarations
				const { error } = await supabase.from('Weeks').delete().eq('id', element.id);
				if (error) erred.push(error);
				break;
		}
	});
	if (erred.length > 0) error(400, erred[0]);
};
