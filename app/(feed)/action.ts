"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function toggleReaction(
  reportId: string,
  userId: string,
  reactionType: "upvote" | "downvote",
) {
  const supabase = await createClient();
  let action: "remove" | "add" | "update" = "add";

  // Check if reaction exists
  const { data: existingReaction } = await supabase
    .from("report_reactions")
    .select()
    .eq("report_id", reportId)
    .eq("user_id", userId)
    .single();

  if (existingReaction) {
    if (existingReaction.type === reactionType) {
      // If same reaction type, remove it
      await supabase
        .from("report_reactions")
        .delete()
        .eq("id", existingReaction.id);
      action = "remove";
    } else {
      // If different reaction type, update it
      await supabase
        .from("report_reactions")
        .update({ type: reactionType })
        .eq("id", existingReaction.id);
      action = "update";
    }
  } else {
    // Create new reaction
    await supabase.from("report_reactions").insert({
      id: generateUuid(),
      report_id: reportId,
      user_id: userId,
      type: reactionType,
    });
    action = "add";
  }

  // Get updated reaction counts
  const { data: updatedReactions } = await supabase
    .from("report_reactions")
    .select("type, user_id")
    .eq("report_id", reportId);

  const counts = {
    upvotes: updatedReactions?.filter((r) => r.type === "upvote").length ?? 0,
    downvotes:
      updatedReactions?.filter((r) => r.type === "downvote").length ?? 0,
    userReaction: action === "remove" ? undefined : reactionType,
  } as const;

  revalidatePath("/feed");
  return { success: true, ...counts };
}

export async function addComment(
  reportId: string,
  userId: string,
  content: string,
) {
  const supabase = await createClient();

  // First create the comment
  const { data: comment, error: commentError } = await supabase
    .from("report_comments")
    .insert({
      id: generateUuid(),
      report_id: reportId,
      user_id: userId,
      content: content,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  console.log(commentError);

  if (commentError || !comment) {
    return { success: false, error: commentError?.message };
  }

  revalidatePath("/feed");
  return { success: true, comment };
}

function generateUuid() {
  return crypto.randomUUID();
}
export async function getReportCount() {
  const supabase = await createClient();
  
  // Get total reports count
  const { count: totalReports } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true });

  // Get today's reports count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayReports } = await supabase
    .from("reports") 
    .select("*", { count: "exact", head: true })
    .gte('created_at', today.toISOString());

  // Get total users count
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  return {
    totalReports: totalReports || 0,
    todayReports: todayReports || 0, 
    totalUsers: totalUsers || 0
  };
}
