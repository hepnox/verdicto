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
        report_files(*, files(*)),
        report_reactions(type, user_id),
        report_comments(*)
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
  fileUrl?: string,
) {
  const supabase = await createClient();

  // First create the comment
  const { data: comment, error: commentError } = await supabase
    .from("report_comments")
    .insert({
      report_id: reportId,
      user_id: userId,
      content: content,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (commentError || !comment) {
    return { success: false, error: commentError?.message };
  }

  // If there's a file, handle it
  if (fileUrl) {
    // First create file record
    const { data: file, error: fileError } = await supabase
      .from("files")
      .insert({
        url: fileUrl,
        user_id: userId,
      })
      .select()
      .single();

    if (fileError || !file) {
      return { success: false, error: fileError?.message };
    }

    // Then create comment_files association
    await supabase.from("comment_files").insert({
      comment_id: comment.id,
      file_id: file.id,
    });
  }

  revalidatePath("/feed");
  return { success: true, comment };
}
