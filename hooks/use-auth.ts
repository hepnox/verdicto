import { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

type MergedUser = User & Tables<"users">;

export function useAuth() {
  const supabase = createClient();

  const { data: user, isLoading } = useQuery<MergedUser | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        return null;
      }

      const { data: dbUser } = await supabase
        .from("users")
        .select()
        .eq("id", authData.user.id)
        .single();
      if (!dbUser) {
        return null;
      }

      return { ...authData.user, ...dbUser };
    },
  });

  return { user, loading: isLoading };
}
