<div class="home-container">
	<h1>Gym Notebook</h1>
	<div class="link-container">
		<a href="/login">Login</a>
		<div class="slash">/</div>
		<a href="/register">Register</a>
	</div>
</div>

<style lang="scss">
	.home-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100svh;
		justify-content: center;
		align-items: center;
		gap: var(--size-fluid-4);
	}
	.link-container {
		display: flex;
		flex-direction: row;
		gap: var(--size-fluid-1);
		justify-content: center;
	}
	a {
		font-size: var(--font-size-fluid-1);
		text-decoration: none;
		color: var(--text-1);
		font-weight: var(--font-weight-6);
		transition: color var(--ease-4);

		&:hover {
			color: var(--text-2);
		}
	}
	.slash {
		font-size: var(--font-size-fluid-1);

		color: var(--text-1);
		font-weight: var(--font-weight-6);
	}
	h1 {
		text-align: center;
	}
</style>
