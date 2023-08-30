<div class="navbar-container"><a href="/">Gym Notebook</a></div>
<slot />

<style lang="scss">
	.navbar-container {
		width: 100%;
		height: var(--size-8);
		position: absolute;
		top: 0px;
		display: flex;
		align-items: center;
	}
	a {
		padding-left: var(--size-fluid-1);
		color: var(--text-1);
		font-size: var(--font-size-fluid-1);
		font-weight: var(--font-weight-7);
		text-decoration: none;
		&:hover {
			text-decoration: var(--accent) wavy underline;
		}
	}
</style>
