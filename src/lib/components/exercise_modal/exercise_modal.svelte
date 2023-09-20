<script lang="ts">
	export let dialogOpened = false;
	export let exercises: any;
	export let exercise: any;

	let queryPhrase = '';
</script>

<dialog id="exercise_type_name_dialog" open={dialogOpened}>
	<div class="dialog-content-container">
		<input bind:value={queryPhrase} placeholder="Search" />
		<div class="types-container">
			{#if exercises}
				{#each exercises as exercise_types}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						on:click={() => {
							exercise.exercise_type_name = exercise_types.name;
							console.log(exercise.exercise_type_name);
							dialogOpened = false;
						}}
					>
						{exercise_types.name}
					</div>
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
</style>
