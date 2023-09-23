<script lang="ts">
	export let day: App.TrainingDay;
	export let modal: HTMLDialogElement;
</script>

{#if day && day.Exercise_Detail}
	<dialog bind:this={modal}>
		{#each day.Exercise_Detail as exercise}
			{exercise.exercise_type_name}
		{/each}
	</dialog>
{/if}

<style lang="postcss">
	h3 {
	}
</style>
