<script lang="ts">
	import { db, auth } from '$lib/firebase.client';
	import { doc, getDoc } from 'firebase/firestore';

	let selectedWeek = $state(0);
	let selectedDay = $state(0);
	let userData: null | unknown = $state(null);
	let trainingData: null | unknown = $state(null);

	const currentUserId = auth.currentUser?.uid;
	if (currentUserId) {
		const userDocumentRef = doc(db, 'UserData', currentUserId?.toString());
		const userDocumentSnap = getDoc(userDocumentRef);
		userDocumentSnap.then((result) => {
			if (result.exists()) userData = result.data();
		});
		// I should get specific elements not all of the data, get currentPlan, currentWeek, currentDay and fetch the plan
	}

	// 1. First fetch the user's data, what plan is currently selected
	// 2. Fetch the specific week and day of the plan, don't fetch the whole plan
	// 2. Map it
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-screen-xl flex-col gap-1 px-4 py-12 lg:py-20">
		<section class="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
			<h1 class="text-base font-semibold lg:text-xl">Plan Name</h1>
			<div class="flex flex-row gap-2 lg:inline-flex">
				<select
					class="select select-primary select-sm text-sm lg:select-md lg:text-base"
					bind:value={selectedWeek}
					onchange={(e: { currentTarget: { value: string | number } }) => {
						selectedWeek = +e.currentTarget.value;
					}}><option value={0}>Week 1</option></select
				>
				<select
					class="select select-primary select-sm appearance-none text-sm lg:select-md lg:text-base"
					bind:value={selectedDay}
					onchange={(e: { currentTarget: { value: string | number } }) => {
						selectedDay = +e.currentTarget.value;
					}}
				>
					<option value={0}>Day 1</option></select
				>
			</div>
		</section>
		<section
			class="flex w-full max-w-screen-xl flex-col items-center text-center text-sm lg:text-base"
		>
			<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
				<h2>Exercise</h2>
				<h2>Set</h2>
				<h2>Reps</h2>
				<h2>RPE</h2>
				<h2>Weight</h2>
			</div>
			<div class="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-1">
				<button class="btn btn-ghost">Dumbell Chest Press</button>
				<h2 class="flex items-center justify-center">1</h2>
				<h2 class="flex items-center justify-center">12-15</h2>
				<h2 class="flex items-center justify-center">8-9</h2>
				<h2 class="flex items-center justify-center">30</h2>
			</div>
		</section>
	</div>
</section>
