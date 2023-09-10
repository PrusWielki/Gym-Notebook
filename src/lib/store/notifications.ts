import { writable } from 'svelte/store';

const notificationMessage = writable('');

export default notificationMessage;
