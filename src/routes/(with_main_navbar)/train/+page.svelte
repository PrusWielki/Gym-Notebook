<script lang="ts">
	let selectedWeek = $state(0);
	let selectedDay = $state(0);
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto flex max-w-screen-xl flex-col gap-1 px-4 py-12 lg:py-20">
		<section class="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
			<h1 class="text-base font-semibold lg:text-xl">Plan Name</h1>
			<div class="flex flex-row gap-2 lg:inline-flex">
				<select
					class="select select-primary select-sm text-sm lg:select-md lg:text-base"
					bind:value={selectedWeek}
					onchange={(e) => {
						selectedWeek = +e.currentTarget.value;
					}}><option disabled value={0}>Week 1</option></select
				>
				<select
					class="select select-primary select-sm text-sm lg:select-md lg:text-base"
					bind:value={selectedDay}
					onchange={(e) => {
						selectedDay = +e.currentTarget.value;
					}}><option disabled value={0}>Day 1</option></select
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
				<h2>asd</h2>
				<h2>Set</h2>
				<h2>asdasdad</h2>
				<h2>RPE</h2>
				<h2>Weight</h2>
			</div>
		</section>
	</div>
</section>
