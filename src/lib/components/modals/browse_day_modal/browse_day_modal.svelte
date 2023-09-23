<script lang="ts">
	import TrainingDayBrowse from '$lib/components/training_day/training_day_browse.svelte';

	export let day: App.TrainingDay;
	export let modal: HTMLDialogElement;
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
