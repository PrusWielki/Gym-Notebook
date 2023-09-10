<script>
	import Toast from '$lib/components/toast/toast.svelte';
</script>

<nav>
	<div class="container nav-container">
		<h5>GN</h5>
		<div class="links">
			<a href="/train">Train</a><a href="/prepare">Prepare</a><a href="/analyze">Analyze</a>
		</div>
		<a href="/logout" class="logout">Logout</a>
	</div>
</nav>
<Toast />
<slot />

<style lang="postcss">
	nav {
		backdrop-filter: blur(var(--radius-2));
		padding: var(--size-1) 0;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		height: var(--size-fluid-6);
		z-index: 999;

		.nav-container {
			display: flex;
			gap: var(--size-fluid-3);
			align-items: center;
			width: 100%;
		}

		a {
			color: var(--text-1);
			font-weight: var(--font-weight-6);
			font-size: var(--font-size-fluid-1);
			&:hover {
				color: var(--accent);
				text-decoration-color: var(--surface-4);
			}
		}
		h5 {
			font-size: var(--font-size-fluid-2);
		}
		.links {
			display: flex;
			gap: var(--size-fluid-2);
			margin: 0 auto;
		}
		.logout {
			font-weight: var(--font-weight-7);
		}
	}
</style>
