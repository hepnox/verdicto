import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuth() {
    const [user, setUser] = useState<User | null>(() => {
        // Try to get user from localStorage on initial render
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchUser() {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error.message);
                setUser(null);
                localStorage.removeItem('user');
            } else {
                setUser(data?.user || null);
                if (data?.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        }

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const newUser = session?.user || null;
                setUser(newUser);
                if (newUser) {
                    localStorage.setItem('user', JSON.stringify(newUser));
                } else {
                    localStorage.removeItem('user');
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { user, loading };
}