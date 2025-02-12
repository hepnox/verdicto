'use server';

import { createClient } from "@/lib/supabase/server";

export async function getCrimeReports() {
    const supabase = await createClient();
    const reports = await supabase.from('reports').select('*, report_files(*, files(*))');
    return reports.data ?? [];
}