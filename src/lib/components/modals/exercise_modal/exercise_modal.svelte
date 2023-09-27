<script lang="ts">
	export let exercises: Array<{ name: string }> | null;
	export let exercise: { exercise_type_name: string | null };
	let modal: HTMLDialogElement;

	let queryPhrase = '';

	$: {
		if (modal) {
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
		}
	}
</script>

<button class="main-button" on:click|preventDefault={() => modal.showModal()}
	>{exercise.exercise_type_name ? exercise.exercise_type_name : 'Exercise'}
</button>
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
							modal.close();
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

		&::-webkit-scrollbar {
			width: 4px;
			height: 4px;
			margin-left: 10px;
		}
		&::-webkit-scrollbar-thumb {
			background: var(--surface-4);
			border-radius: 2px;
		}
	}
	.dialog-content-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
		height: 100%;
	}

	.exercise {
		cursor: pointer;
	}
	input {
		text-align: center;
	}
	.main-button {
		appearance: none;
		background: #17191c;
		padding: var(--size-1);
		border-radius: var(--radius-1);
		@media (--OSlight) {
			background: #e0e4e5;
		}
	}
	button {
		appearance: none;
		background: var(--surface-1);
	}
</style>
