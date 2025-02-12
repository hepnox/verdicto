'use server';
import { createClient } from "@/lib/supabase/server";

export async function getCrimeReports() {
    const supabase = await createClient();
    const reports = await supabase
      .from("reports")
      .select(
        `
          *,
          geolocations(*),
          users(full_name),
          report_files(*, files(*)),
          report_reactions(type, user_id),
          report_comments(*, users(full_name))
      `,
      )
      .order("created_at", { ascending: false });
    return reports.data ?? [];
  }