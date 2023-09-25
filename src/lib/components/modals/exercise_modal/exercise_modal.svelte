<script lang="ts">
	export let dialogOpened: Array<boolean>;
	export let index: number;
	export let exercises: Array<{ name: string }> | null;
	export let exercise: { exercise_type_name: string | null };
	let modal: HTMLDialogElement;
	let eventSet: boolean = false;


	let queryPhrase = '';

	$: {
		if (modal) {
			if (dialogOpened[index]) {
				modal.showModal();
				if (!eventSet) {
					modal.addEventListener('click', function (event) {
						var rect = modal.getBoundingClientRect();
						var isInDialog =
							rect.top <= event.clientY &&
							event.clientY <= rect.top + rect.height &&
							rect.left <= event.clientX &&
							event.clientX <= rect.left + rect.width;
						if (!isInDialog) {
							modal.close();
						}
					});
					eventSet = true;

				}
			} else modal.close();
		}
	}
</script>

<dialog id="exercise_type_name_dialog" bind:this={modal}>
	<div class="dialog-content-container">
		<input bind:value={queryPhrase} placeholder="Search" />
		<div class="types-container">
			{#if exercises}
				{#each exercises.filter((exercise_type) => exercise_type.name
						.toLowerCase()
						.includes(queryPhrase.toLowerCase())) as exercise_types}
					<button
						on:click|preventDefault={() => {
							exercise.exercise_type_name = exercise_types.name;

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
		height: 50%;
		@media (--md-n-below) {
			width: 90%;
			top: 5%;
			margin-top: 0;
		}
	}
	.types-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-2);
		height: 100%;
		overflow-y: auto;
	}
	.dialog-content-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
		height: 100%;
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
