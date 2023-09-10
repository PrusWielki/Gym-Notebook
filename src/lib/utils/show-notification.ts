import type { Writable } from 'svelte/store';

export const showNotification = (
	message: string,
	time: number,
	notificationMessage: Writable<string>
) => {
	notificationMessage.set(message);
	setTimeout(() => {
		notificationMessage.set('');
	}, time);
};
