<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let state: 'Loading' | 'Done' = 'Done';
	if (data.plan) {
		state = 'Loading';

		fetch(`api/plans/${data.plan[0].plan_id}`, { method: 'GET' }).then((response) => {
			console.log(response);
			state = 'Done';
		});
	}
</script>

{#if state === 'Loading'}
	<h4>Loading...</h4>
{:else}
	<h1>xd</h1>
{/if}

<style lang="postcss">
	h4 {
		margin-top: var(--size-fluid-6);
		text-align: center;
		background: var(--gradient-3);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
