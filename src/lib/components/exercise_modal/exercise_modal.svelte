<script lang="ts">
	export let dialogOpened: Array<boolean>;
	export let index: number;
	export let exercises: Array<{ name: string }> | null;
	export let exercise: { exercise_type_name: string | null };

	let queryPhrase = '';
</script>

<dialog id="exercise_type_name_dialog" open={dialogOpened[index]}>
	<div class="dialog-content-container">
		<input bind:value={queryPhrase} placeholder="Search" />
		<div class="types-container">
			{#if exercises}
				{#each exercises.filter((exercise_type) => exercise_type.name
						.toLowerCase()
						.includes(queryPhrase)) as exercise_types}
					<button
						on:click|preventDefault={() => {
							exercise.exercise_type_name = exercise_types.name;
							console.log(exercise.exercise_type_name);

							dialogOpened[index] = false;
							queryPhrase = '';
						}}
						class="exercise"
					>
						{exercise_types.name}
					</button>
				{/each}
			{/if}
		</div>
	</div>
</dialog>

<style lang="postcss">
	dialog {
		background-color: var(--surface-1);
		z-index: 10;
		width: 50%;
		top: 50%;
		max-height: 50%;
		@media (--md-n-below) {
			width: 90%;
		}
	}
	.types-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-2);
		overflow-y: auto;
	}
	.dialog-content-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
	}
	input {
		text-align: center;
		&::placeholder {
			color: var(--text-1);
		}
	}
	.exercise {
		cursor: pointer;
	}
	button {
		appearance: none;
		background: var(--surface-1);
	}
</style>
