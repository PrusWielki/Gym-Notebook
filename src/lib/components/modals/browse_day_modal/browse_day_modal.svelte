<script lang="ts">
	import TrainingDayBrowse from '$lib/components/training_day/training_day_browse.svelte';

	export let day: App.TrainingDay;
	export let modal: HTMLDialogElement;

	$: modal && setModalClose(modal);

	function setModalClose(modal: HTMLDialogElement) {
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
</script>

<dialog bind:this={modal}>
	{#if day && day.Exercise_Detail}
		<TrainingDayBrowse {day} />
	{/if}
	<button
		on:click={() => {
			modal.close();
		}}>Close</button
	>
</dialog>
