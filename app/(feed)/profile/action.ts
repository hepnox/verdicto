"use server";

import { createClient } from "@/lib/supabase/server";

interface UpdateProfileData {
  id: string;
  full_name: string;
  phone: string;
  status: string;
  avatarUrl?: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("users")
      .update({
        full_name: data.full_name,
        phone: data.phone,
        ...(data.avatarUrl && { avatar_url: data.avatarUrl }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
}
