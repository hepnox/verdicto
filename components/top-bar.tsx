"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { CreatePostButton } from "./create-post-button";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

export const TopBar = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const supabase = createClient();

    const handleComments = async (payload: any) => {
      if (!user?.id) return;
      const { data: report } = await supabase
        .from("reports")
        .select("*")
        .eq("id", payload.new.report_id)
        .single();

      if (report?.user_id === user.id) {
        toast({
          title: "New Comment",
          description: "Someone commented on your report",
        });
      }
    };

    const handleInserts = async (payload: any) => {
      console.log(payload);

      if (!user?.id) return;
      const { data: report } = await supabase
        .from("reports")
        .select("*")
        .eq("id", payload.new.report_id)
        .single();

      if (report?.user_id === user.id) {
        const reactionType =
          payload.new.type === "upvote" ? "upvoted" : "downvoted";
        toast({
          title: `New ${reactionType.charAt(0).toUpperCase() + reactionType.slice(1)}`,
          description: `Someone ${reactionType} your report`,
        });
      }
    };

    const reactionChannel = supabase
      .channel("reaction-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "report_reactions" },
        handleInserts,
      )
      .subscribe();

    const commentChannel = supabase
      .channel("comment-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "report_comments" },
        handleComments,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reactionChannel);
      supabase.removeChannel(commentChannel);
    };
  }, [user?.id]);

  return (
    <div className="w-full flex items-center justify-between gap-2 px-4 py-3 sticky top-0 bg-background z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbNav />
      </div>
      <div className="flex items-center gap-2">
        <CreatePostButton />
      </div>
    </div>
  );
  return null;
};
