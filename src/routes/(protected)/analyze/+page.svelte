<script lang="ts">
	import Statistics from '$lib/components/analyze/statistics/statistics.svelte';

	import BrowseDayModal from '$lib/components/modals/browse_day_modal/browse_day_modal.svelte';
	import type { PageData } from './$types';

	let modal: HTMLDialogElement;
	export let data: PageData;
	let modalDay: App.TrainingDay;
	let checked: 'Browse' | 'Statistics' = 'Browse';

	// 1. Add sorting and filtering.
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
						<div class="labels-container">
							<div class="set-container">
								<h5>Exercise</h5>
								<h5>Reps</h5>
								<h5>RPE</h5>
								<h5>Weight</h5>
								<h5 class="desktop-only">Date</h5>
							</div>
						</div>

						<div class="browse-container">
							{#each value.data as plan}
								{#each plan.Weeks as week}
									{#each week.Days as day}
										{#each day.Exercise_Detail as exercise}
											{#each exercise.Exercise_Detail_Sets as set}
												<div class="set-container">
													<h5>{exercise.exercise_type_name}</h5>
													<h5>{set.reps}</h5>
													<h5>{set.rpe}</h5>
													<h5>{set.weight}</h5>
													<h5 class="desktop-only">
														{set.creation_date.slice(0, 16).replace('T', ' ')}
													</h5>
												</div>
											{/each}{/each}{/each}{/each}{/each}
						</div>
					{/if}
				{:catch error}
					{error.message}
				{/await}
			{:else if checked === 'Statistics'}
				{#await data.allData}
					Loading...
				{:then value}
					{#await data.exerciseTypes then exercises}
						<Statistics allData={value.data} exerciseTypes={exercises.data} />
					{/await}
				{:catch error}
					{error.message}
				{/await}
			{/if}
		</div>
	</div>
</div>

<!-- <BrowseDayModal bind:modal day={modalDay} /> -->

<style lang="postcss">
	.labels-container {
		padding-top: var(--size-6);
		width: 100%;
	}

	.analyze-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: var(--size-fluid-6) 0;
	}
	.desktop-only {
		display: block;
		@media (--sm-n-below) {
			display: none;
		}
	}
	.browse-container {
		display: flex;
		flex-direction: column;
		padding: var(--size-4) 0 var(--size-1) 0;
		align-items: center;
		width: 100%;
		overflow-y: auto;
		max-height: 58lvh;

		&::-webkit-scrollbar {
			width: 4px;
			height: 4px;
			margin-left: 10px;
		}
		&::-webkit-scrollbar-thumb {
			background: var(--surface-4);
			border-radius: 2px;
		}

		div {
			padding: var(--size-5) 0;
			border-bottom: var(--border-size-2) var(--accent) dashed;
		}
	}
	.set-container {
		display: grid;
		grid-template-columns: 1.2fr 0.4fr 0.4fr 0.6fr 1fr;
		text-align: center;
		gap: var(--size-fluid-2);
		width: 100%;

		@media (--sm-n-below) {
			grid-template-columns: 1.2fr 0.4fr 0.4fr 0.6fr;
		}
		h5 {
			text-overflow: ellipsis;
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			@media (--md-n-below) {
				font-size: var(--font-size-1);
			}
		}
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
		margin-top: var(--size-1);
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
