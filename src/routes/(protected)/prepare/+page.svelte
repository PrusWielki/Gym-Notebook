<script lang="ts">
	import EditPlan from '$lib/components/prepare/edit_plan/edit_plan.svelte';
	import type { PageData } from './$types';
	import ExistingPlan from '$lib/components/prepare/existing_plan/existing_plan.svelte';
	import NewPlan from '$lib/components/prepare/new_plan/new_plan.svelte';
	import { parse } from 'svelte/compiler';
	import { json } from '@sveltejs/kit';

	export let data: PageData;
	let checked: 'New' | 'Edit' | 'Existing' = 'Existing';
</script>

<div class="wrapper">
	<div class="container">
		<div class="prepare-container">
			<h2>Prepare Your training plan</h2>
			<div class="tabs">
				<label class="tab">
					<input
						type="radio"
						name="tab-input"
						bind:group={checked}
						value="Existing"
						class="tab-input"
						on:change={async () => {
							await fetch('api/plans', { method: 'GET' }).then(async (response) => {
								await response.json().then((result) => {
									data.plans = result.data;
								});
							});
						}}
					/>
					<div class="tab-box">Existing Plan</div>
				</label>
				<label class="tab">
					<input type="radio" name="tab-input" class="tab-input" bind:group={checked} value="New" />
					<div class="tab-box">New Plan</div>
				</label>
				<label class="tab">
					<input
						type="radio"
						name="tab-input"
						bind:group={checked}
						value="Edit"
						class="tab-input"
					/>
					<div class="tab-box">Edit Plan</div>
				</label>
			</div>
			<div class={` ${checked === 'Existing' ? 'choose-plan-container' : ' hidden'} `}>
				<ExistingPlan plans={data.plans.data} />
			</div>
			<div class={`${checked === 'New' ? '' : 'hidden'}`}>
				<NewPlan periodizations={data.periodizations.data} exercises={data.exercises.data} />
			</div>

			<div class={`${checked === 'Edit' ? '' : 'hidden'}`}>
				<EditPlan exercises={data.exercises.data} />
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.hidden {
		display: none !important;
	}
	.choose-plan-container {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
		justify-content: center;
		align-items: center;
	}

	.prepare-container {
		padding: var(--size-fluid-6) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		gap: var(--size-4);
		h2 {
			background: var(--gradient-3);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			@media (--md-n-below) {
				font-size: var(--font-size-4);
				letter-spacing: var(--font-letterspacing-0);
			}
		}

		input {
			font-size: var(--font-size-fluid-1);
			text-align: center;
			&::placeholder {
				color: var(--text-1);
			}
		}
	}

	.loading {
		font-size: var(--font-size-fluid-2);
		padding: 0 var(--size-fluid-6);
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
