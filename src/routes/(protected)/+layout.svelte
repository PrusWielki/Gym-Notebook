<nav>
	<h5>GN</h5>
	<div class="links">
		<a href="/train">Train</a><a href="/prepare">Prepare</a><a href="/analyze">Analyze</a>
	</div>
	<a href="/logout" class="logout">Logout</a>
</nav>
<slot />

<style lang="postcss">
	nav {
		background-color: var(--surface-1);
		backdrop-filter: blur(var(--radius-6));
		padding: var(--size-3) var(--size-4);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		gap: var(--size-fluid-3);
		align-items: center;

		@media (--sm-n-above) {
		}
		a {
			color: var(--text-1);
			font-weight: var(--font-weight-6);
			font-size: var(--font-size-fluid-1);
			&:hover {
				color: var(--accent);
			}
		}
	}

	.links {
		display: flex;
		gap: var(--size-fluid-3);
	}
	.logout {
		margin-left: auto;
		cursor: pointer;
		font-weight: var(--font-weight-7);
	}
</style>
