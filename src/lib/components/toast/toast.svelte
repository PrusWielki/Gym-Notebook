<script>
	import { fade } from 'svelte/transition';
	import notificationMessage from '$lib/store/notifications';
	let message = '';
	notificationMessage.subscribe((value) => {
		message = value;
	});
</script>

{#if message}
	<div in:fade out:fade class="toast-container"><h4>{message}</h4></div>
{/if}

<style lang="postcss">
	.toast-container {
		display: flex;
		position: fixed;
		top: var(--size-fluid-6);
		left: 50%;
		transform: translateX(-50%);

		padding: var(--size-4) var(--size-2);
		backdrop-filter: blur(var(--radius-3));
		width: 100%;
		justify-content: center;
	}
</style>
