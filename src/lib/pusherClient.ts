import Pusher from 'pusher-js';

// Initialize Pusher Client
export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '81923232bb82a2099309', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    forceTLS: true,
});

/**
 * Subscribe to a specific user channel to listen for matchmaking events
 */
export const subscribeToUser = (address: string) => {
    const channelName = `user-${address}`;
    return pusherClient.subscribe(channelName);
};

/**
 * Subscribe to a specific battle session channel for real-time updates
 */
export const subscribeToSession = (sessionId: string) => {
    const channelName = `session-${sessionId}`;
    return pusherClient.subscribe(channelName);
};

/**
 * Unsubscribe from a user channel
 */
export const unsubscribeFromUser = (address: string) => {
    pusherClient.unsubscribe(`user-${address}`);
};

/**
 * Unsubscribe from a session channel
 */
export const unsubscribeFromSession = (sessionId: string) => {
    pusherClient.unsubscribe(`session-${sessionId}`);
};

export default pusherClient;
