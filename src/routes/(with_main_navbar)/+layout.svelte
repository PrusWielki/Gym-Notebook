<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemePicker from '$lib/components/theme_picker/theme_picker.svelte';
	import { getAuth, signOut } from 'firebase/auth';
	import { session } from '$lib/session';

	import ThemePickerSelect from '$lib/components/theme_picker_select/theme_picker_select.svelte';
	import { showNotification } from '$lib/hooks/show-notification';
	import { browser } from '$app/environment';

	let loggedIn = false;
	if (browser)
		session.subscribe((value) => {
			if (value?.loggedIn === false) goto('/');
			else if (value && value.loggedIn === true) loggedIn = true;
		});
	let resultsMenu: HTMLDetailsElement;
	// if (browser)
	// 	document.addEventListener('click', function () {
	// 		if (resultsMenu && resultsMenu.removeAttribute) resultsMenu.removeAttribute('open');
	// 	});
</script>

{#if loggedIn}
	<div class="font-montserrat fixed top-0 z-10 w-full bg-transparent backdrop-blur-md">
		<div class="navbar mx-auto min-h-0 max-w-(--breakpoint-xl) px-4">
			<div class="navbar-start w-fit lg:w-1/2">
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1">
					Button
				</button>
				<ul
					class="dropdown menu rounded-box bg-base-100 w-52 shadow-sm"
					popover="auto"
					id="popover-1"
					style="position-anchor:--anchor-1"
				>
					<li>
						<ThemePickerSelect class="my-2" />
					</li>
					<li>
						<button
							on:click={() => {
								const auth = getAuth();
								signOut(auth)
									.then(() => {
										goto('/');
									})
									.catch(() => {
										showNotification('Logout Error!', 2000, 'Failure');
									});
							}}
							class="btn btn-ghost btn-secondary btn-sm">Logout</button
						>
					</li>
				</ul>

				<a href="/train" class="btn btn-ghost hidden text-xl font-semibold lg:flex">Gym Notebook</a>
			</div>
			<div class="navbar-center mx-auto gap-2 lg:mx-0">
				<a href="/train" class="btn btn-ghost btn-sm lg:btn-md mx-auto lg:text-lg">Train</a>
				<a href="/prepare" class="btn btn-ghost btn-sm lg:btn-md mx-auto lg:text-lg">Prepare</a>
				<a href="/reflect" class="btn btn-ghost btn-sm lg:btn-md mx-auto lg:text-lg">Reflect</a>
			</div>

			<div class="navbar-end hidden gap-4 lg:flex">
				<ThemePicker class="" />
				<button
					on:click={() => {
						const auth = getAuth();
						signOut(auth)
							.then(() => {
								goto('/');
							})
							.catch(() => {
								showNotification('Logout Error!', 2000, 'Failure');
							});
					}}
					class="btn btn-ghost btn-secondary btn-sm">Logout</button
				>
			</div>
		</div>
	</div>
	<slot />
{/if}
