<script lang="ts">
	import BrowseDayModal from '$lib/components/modals/browse_day_modal/browse_day_modal.svelte';
	import type { PageData } from './$types';

	let modal: HTMLDialogElement;
	export let data: PageData;
	let modalDay: App.TrainingDay;
	let checked: 'Browse' | 'Statistics' = 'Browse';
</script>

<div class="wrapper">
	<div class="container">
		<div class="analyze-container">
			<div class="tabs">
				<label class="tab">
					<input
						type="radio"
						name="tab-input"
						bind:group={checked}
						value="Browse"
						class="tab-input"
					/>
					<div class="tab-box">Browse</div>
				</label>
				<label class="tab">
					<input
						type="radio"
						name="tab-input"
						class="tab-input"
						bind:group={checked}
						value="Statistics"
					/>
					<div class="tab-box">Statistics</div>
				</label>
			</div>

			{#if checked === 'Browse'}
				{#await data.allData}
					Loading...
				{:then value}
					{#if value.data}
						{#each value.data as plan}
							{#each plan.Weeks as week}
								{#each week.Days as day}
									<button
										on:click={() => {
											modalDay = day;
											modal.showModal();
										}}
									>
										{day.name}
									</button>{/each}{/each}{/each}
					{/if}
				{:catch error}
					{error.message}
				{/await}
			{:else if checked === 'Statistics'}
				Here
			{/if}
		</div>
	</div>
</div>
<BrowseDayModal bind:modal day={modalDay} />

<style lang="postcss">
	.analyze-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: var(--size-fluid-6) 0;
	}
	h3 {
		margin-top: var(--size-fluid-6);
		text-align: center;
		justify-self: center;
		background: var(--gradient-3);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.tabs {
		--bar-color: var(--accent);
		--background: transparent;

		font-size: var(--font-size-fluid-0);
		display: flex;
		width: 100%;
		border: var(--border-size-1) solid var(--accent);
		color: var(--text-1);
	}

	.tabs > .tab {
		flex: 1;
		display: flex;
	}

	.tab > .tab-input {
		width: 0;
		height: 0;
		margin: 0;
		display: none;
	}

	.tab > .tab-box {
		padding: var(--size-3);
		width: 100%;
		text-align: center;
		transition: 0.5s;
		border-bottom: var(--border-size-3) solid rgba(0, 0, 0, 0);
	}

	.tab > .tab-input:checked + .tab-box {
		background: var(--background);
		border-color: var(--bar-color);
	}
</style>
