<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { session, type SessionState, type User } from '$lib/session';
	import { goto } from '$app/navigation';

	let { children, data } = $props();

	onMount(async () => {
		try {
			const user: User = (await data.getAuthUser()) as User;

			const loggedIn = !!user;
			session.update((cur: SessionState) => {
				return {
					...cur,
					user,
					loggedIn,
					loading: false
				};
			});

			if (loggedIn) {
				goto('/main');
			}
		} catch {
			goto('/');
		}
	});
</script>

{@render children()}
