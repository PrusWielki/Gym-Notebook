<script lang="ts">
	export let planName: string;
	export let modal: HTMLDialogElement;
</script>

<dialog bind:this={modal}>
	<div>{planName}</div>
</dialog>

<style lang="postcss">
	h3 {
	}
</style>
