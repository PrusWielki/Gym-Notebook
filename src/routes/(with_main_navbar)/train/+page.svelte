<script lang="ts">
	let selectedWeek = $state(0);
	let selectedDay = $state(0);
</script>

<section class="h-[100dvh] w-full">
	<div class="mx-auto max-w-screen-xl px-4 py-16 lg:py-20">
		<section class="flex flex-col items-center gap-2 lg:flex-row lg:justify-center">
			<h1 class="text-base font-semibold lg:text-xl">Plan Name</h1>
			<div class="flex flex-row gap-2 lg:inline-flex">
				<select
					class="select select-primary"
					bind:value={selectedWeek}
					onchange={(e) => {
						selectedWeek = +e.currentTarget.value;
					}}><option disabled value={0}>Week 1</option></select
				>
				<select
					class="select select-primary"
					bind:value={selectedDay}
					onchange={(e) => {
						selectedDay = +e.currentTarget.value;
					}}><option disabled value={0}>Day 1</option></select
				>
			</div>
		</section>
	</div>
</section>
