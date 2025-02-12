'use client';

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase/client';
import useFcmToken from '@/hooks/use-fcm';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const supabase = createClient();

export default function SubscribeNotification() {
    const { toast } = useToast();
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
                if (payload.notification) {
                    toast({
                        title: payload.notification.title,
                        description: payload.notification.body,
                    })
                }
            });
            return () => unsubscribe();
        }
    }, []);

    return null;
}