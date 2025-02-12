"use client";

import { CreatePostButton } from "./create-post-button";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { useAuth } from "@/hooks/use-auth";

export const TopBar = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const supabase = createClient();

    const handleInserts = async (payload: any) => {
      if (!user?.id) return;
      const { data: report } = await supabase
        .from("reports")
        .select("*")
        .eq("id", payload.new.report_id)
        .single();

      if (report?.user_id === user.id) {
        const reactionType = payload.new.type === "upvote" ? "upvoted" : "downvoted";
        setNotifications((prev) => [
          ...prev,
          {
            type: "reaction",
            title: `New ${reactionType.charAt(0).toUpperCase() + reactionType.slice(1)}`,
            description: `Someone ${reactionType} your report`,
            id: payload.new.id,
          },
        ]);
      }
    };

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "report_reactions" },
        handleInserts,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // return null;
  
  return (
    <div className="w-full flex items-center justify-between gap-2 px-4 py-2 sticky top-0 bg-background z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbNav />
      </div>
      <div className="flex items-center gap-2">
        <CreatePostButton />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {notifications.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" side="top" className="p-2">
            <div className="flex flex-col gap-2 w-full">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-lg cursor-pointer"
                >
                  <Bell className="h-4 w-4 text-primary" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="py-2 px-3 text-sm text-muted-foreground">
                  No new notifications
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
