<script lang="ts">
	import ExerciseModal from '../modals/exercise_modal/exercise_modal.svelte';

	export let exercises: Array<{ name: string; id: number }> | null;
	export let day: App.TrainingDay;
	export let toRemove: Array<{ type: 'Day' | 'Week' | 'Exercise_Detail'; id: number }> | null =
		null;
</script>

{#if day.Exercise_Detail.length > 0}
	<div class="day-container">
		<input class="input-day-name" required placeholder="day name" bind:value={day.name} />
		<div class="day-label-row">
			<h5>Exercise</h5>
			<h5>Sets</h5>
			<h5>Reps</h5>
			<h5>RPE</h5>
		</div>
		{#each day.Exercise_Detail as exercise, exercise_index}
			<div class="day-row-input">
				<ExerciseModal bind:exercise {exercises} />

				<input required bind:value={exercise.sets} placeholder="Sets" />
				<input required bind:value={exercise.target_reps} placeholder="Reps" />
				<input required bind:value={exercise.target_rpe} placeholder="RPE" />
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<svg
					tabindex="0"
					on:click={() => {
						let removed = day.Exercise_Detail.splice(exercise_index, 1);
						day = day;
						if (removed[0].id && toRemove !== null)
							toRemove.push({ type: 'Exercise_Detail', id: +removed[0].id });
					}}
					on:keydown={(e) => {
						let removed;
						if (e.key === 'Enter') {
							removed = day.Exercise_Detail.splice(exercise_index, 1);
							day = day;
							if (removed[0].id && toRemove !== null)
								toRemove.push({ type: 'Exercise_Detail', id: +removed[0].id });
						}
					}}
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					class="bi bi-trash"
					viewBox="0 0 16 16"
				>
					<path
						d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
					/>
					<path
						fill-rule="evenodd"
						d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
					/>
				</svg>
			</div>
		{/each}
		<!-- svelte-ignore a11y-interactive-supports-focus -->
		<svg
			tabindex="0"
			on:click={() => {
				day.Exercise_Detail = [
					...day.Exercise_Detail,
					{
						order: day.Exercise_Detail.length + 1,
						id: null,
						sets: null,
						target_reps: null,
						target_rpe: null,
						exercise_type_name: null,
						Exercise_Detail_Sets: null
					}
				];
			}}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					day.Exercise_Detail = [
						...day.Exercise_Detail,
						{
							order: day.Exercise_Detail.length + 1,
							id: null,
							sets: null,
							target_reps: null,
							target_rpe: null,
							exercise_type_name: null,
							Exercise_Detail_Sets: null
						}
					];
				}
			}}
			role="button"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 50 50"
			fill="currentColor"
		>
			<path
				d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"
			></path>
		</svg>
	</div>
{/if}

<style lang="postcss">
	.day-container {
		display: flex;
		flex-direction: column;
		border: var(--border-size-2) var(--accent) solid;
		padding: var(--size-fluid-3) var(--size-fluid-2);
		border-radius: var(--radius-2);
		box-shadow: var(--shadow-1);
		gap: var(--size-fluid-2);
		max-width: var(--size-md);
		width: 100%;
		h5 {
			font-size: var(--font-size-fluid-0);
		}
		svg {
			margin: 0 auto;
			cursor: pointer;
			width: 24px;
			height: 24px;
		}
	}
	.day-label-row {
		display: grid;
		grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.3fr;
		width: 100%;
		text-align: center;
		gap: var(--size-2);
	}
	.day-row-input {
		display: grid;
		grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.3fr;
		width: 100%;
		text-align: center;
		gap: var(--size-2);
		align-items: center;

		input {
			width: var(--size-11);
			font-size: var(--font-size-1);
			text-align: center;
			width: 100%;
			@media (--md-n-below) {
				font-size: var(--font-size-0);
			}
		}
		svg {
			margin: 0 auto;
			cursor: pointer;
			width: 20px;
			height: 20px;
			&:focus {
				border: none;
			}
			@media (--md-n-below) {
				width: 15px;
				height: 15px;
			}
		}
	}

	.input-day-name {
		width: 50%;
		justify-self: center;
		align-self: center;
		text-align: center;
	}
</style>
