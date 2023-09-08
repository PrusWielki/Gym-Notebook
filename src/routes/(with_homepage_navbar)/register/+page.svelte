<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<main class="login-page-wrapper">
	<form method="post" class="form-container" use:enhance>
		<div class="input-label-container">
			<h5 class="label">Email</h5>
			<input required name="email" value={form?.email ?? ''} />
		</div>
		<div class="input-label-container">
			<h5 class="label">Password</h5>
			<input required type="password" name="password" />
		</div>
		<button>Register</button>
	</form>
</main>

<style lang="postcss">
	.login-page-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100svh;
	}
	.form-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-fluid-3);
		padding: 0 var(--size-fluid-1);
	}

	.input-label-container {
		display: grid;
		gap: var(--size-fluid-1);
		grid-template-columns: 1fr 1fr;
	}
	.label {
		justify-self: center;
		font-size: var(--font-size-fluid-2);
		color: var(--text-1);
		align-self: center;
	}
	input {
		background-color: var(--surface-4);
		padding: var(--size-fluid-1);
		color: var(--text-1);
	}
	button {
		background-color: var(--button-1);
		border-radius: var(--radius-1);
		padding: var(--size-fluid-1);
		transition: background-color 0.5s var(--ease-3);
		font-size: var(--font-size-fluid-1);
		color: var(--text-1);
		font-weight: var(--font-weight-7);

		&:hover {
			background-color: var(--button-2);
		}
	}
</style>
