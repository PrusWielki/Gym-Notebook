<script lang="ts">
	import { onMount } from 'svelte';
	import { getExercises, addExercise, type ExerciseDefinition } from '$lib/hooks/manage-exercises';

	export let value = '';
	export let placeholder = 'Select Exercise';

	let exercises: ExerciseDefinition[] = [];
	let searchTerm = '';
	let showDropdown = false;
	let loading = false;
	let addingNew = false;
	let containerRef: HTMLDivElement;
	let selecting = false;

	// Sync searchTerm with value prop
	$: {
		if (value && value !== searchTerm) {
			searchTerm = value;
		}
	}

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef && !containerRef.contains(event.target as Node) && !selecting) {
				showDropdown = false;
			}
			selecting = false;
		};

		document.addEventListener('click', handleClickOutside);
		loadExercises();

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	async function loadExercises() {
		loading = true;
		try {
			exercises = await getExercises();
		} catch (error) {
			console.error('Error loading exercises:', error);
		} finally {
			loading = false;
		}
	}

	$: filteredExercises = exercises.filter((exercise) =>
		exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	async function handleAddExercise() {
		if (!searchTerm.trim()) return;

		try {
			await addExercise({ name: searchTerm.trim() });
			exercises = await getExercises();
			value = searchTerm.trim();
			showDropdown = false;
			addingNew = false;
		} catch (error) {
			console.error('Error adding exercise:', error);
			alert(error instanceof Error ? error.message : 'Error adding exercise');
		}
	}

	function handleSelect(exerciseName: string) {
		selecting = true;
		value = exerciseName;
		searchTerm = exerciseName;
		showDropdown = false;
	}
</script>

<div class="relative" bind:this={containerRef}>
	<input
		type="text"
		class="input input-bordered input-sm col-span-2 w-full"
		{placeholder}
		bind:value={searchTerm}
		onfocus={() => (showDropdown = true)}
	/>

	{#if showDropdown}
		<div
			class="bg-base-100 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg"
			role="listbox"
		>
			{#if loading}
				<div class="p-2 text-center">Loading exercises...</div>
			{:else if filteredExercises.length === 0}
				<div class="p-2 text-center">
					No matches found
					<button class="btn btn-primary btn-sm ml-2" onclick={() => (addingNew = true)}>
						Add New
					</button>
				</div>
			{:else}
				{#each filteredExercises as exercise}
					<button
						class="hover:bg-base-200 w-full px-4 py-2 text-left"
						onclick={() => handleSelect(exercise.name)}
					>
						{exercise.name}
					</button>
				{/each}
			{/if}
		</div>
	{/if}

	{#if addingNew}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="text-lg font-bold">Add New Exercise</h3>
				<p class="py-4">
					Add "{searchTerm}" to the exercise database?
				</p>
				<div class="modal-action">
					<button class="btn btn-ghost" onclick={() => (addingNew = false)}> Cancel </button>
					<button class="btn btn-primary" onclick={handleAddExercise}> Add Exercise </button>
				</div>
			</div>
		</div>
	{/if}
</div>
