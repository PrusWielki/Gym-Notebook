<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<main class="login-page-wrapper">
	<form method="post" class="form-container" use:enhance>
		<div class="inputs-container">
			<input required name="email" placeholder="Email" value={form?.email ?? ''} />
			<input required type="password" placeholder="Password" name="password" />
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
	.inputs-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-fluid-3);
	}
	.form-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-fluid-5);
		padding: var(--size-fluid-1);
	}

	input {
		background-color: var(--surface-3);
		padding: var(--size-1);
		color: var(--text-1);
		font-size: var(--font-size-3);
		&::placeholder {
			color: var(--text-1);
			text-align: center;
		}
	}
	button {
		background-color: var(--button-1);
		border-radius: var(--radius-1);
		padding: var(--size-1) var(--size-3);
		transition: background-color 0.5s var(--ease-3);
		font-size: var(--font-size-3);
		color: var(--text-1);
		font-weight: var(--font-weight-7);

		&:hover {
			background-color: var(--button-2);
		}
	}
</style>
