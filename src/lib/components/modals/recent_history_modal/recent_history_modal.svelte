<script lang="ts">
	export let modal: HTMLDialogElement;
	export let exerciseType: string;

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
			// fetch
		}
	}
</script>

<dialog bind:this={modal}><div class="stats-container">Data</div></dialog>

<style lang="postcss">
	.stats-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
	}
</style>
