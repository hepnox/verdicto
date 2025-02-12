'use client';

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase/client';
import useFcmToken from '@/hooks/use-fcm';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

const supabase = createClient();

export default function SubscribeNotification() {
    const { user } = useAuth();
    const { fcmToken } = useFcmToken();

    useEffect(() => {
        const updateFcmToken = async () => {
            if (fcmToken && user?.id) {
               await supabase.from('users').update({ fcm_token: fcmToken }).eq('id', user?.id);
            }
        };
        updateFcmToken();
    }, [fcmToken, user?.id]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground push notification received:', payload);
            });
            return () => unsubscribe();
        }
    }, []);

    return null;
}