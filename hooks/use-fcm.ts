import { useEffect, useState } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase/client';

const useFcmToken = () => {
    const [token, setToken] = useState('');
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);
                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY
                        });
                        if (currentToken) {
                            setToken(currentToken);
                        } else {
                            console.log(
                                'No registration token available. Request permission to generate one.'
                            );
                        }
                    }
                }
            } catch (error) {
                console.log('An error occurred while retrieving token:', error);
            }
        };

        retrieveToken();
    }, []);

    return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;