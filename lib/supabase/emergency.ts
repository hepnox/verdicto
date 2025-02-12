import { createClient } from "@supabase/supabase-js";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  user_id: string;
}

export async function getEmergencyContactsByFilter(
  filter: string,
  userId: string,
): Promise<EmergencyContact[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", `%${filter}%`);

  if (error) {
    throw new Error(`Error fetching emergency contacts: ${error.message}`);
  }

  return data || [];
}

export async function getEmergencyContactData(
  contactId: string,
): Promise<EmergencyContact | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("id", contactId)
    .single();

  if (error) {
    throw new Error(`Error fetching emergency contact: ${error.message}`);
  }

  return data;
}
