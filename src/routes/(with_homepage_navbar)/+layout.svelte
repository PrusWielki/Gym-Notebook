<div class="navbar-container"><a href="/">Gym Notebook</a></div>
<slot />

<style lang="postcss">
	.navbar-container {
		width: 100%;
		height: var(--size-8);
		position: absolute;
		top: 0px;
		display: flex;
		align-items: center;
	}
	a {
		padding: var(--size-fluid-1) var(--size-fluid-2);
		color: var(--text-1);
		font-size: var(--font-size-4);
		font-weight: var(--font-weight-7);
	}
</style>
