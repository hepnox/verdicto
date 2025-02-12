"use client";

import { CreatePostButton } from "./create-post-button";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { BreadcrumbNav } from "./breadcrumb-nav";

export const TopBar = () => {
  useEffect(() => {
    const supabase = createClient();

    const handleInserts = (payload: unknown) => {
      console.log("Change received!", payload);
    };

    const channel = supabase
      .channel("users")
      .on("postgres_changes", { event: "*", schema: "public" }, handleInserts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" side="top" className="p-2">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-lg cursor-pointer">
                <Bell className="h-4 w-4 text-primary" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">New Comment</p>
                  <p className="text-xs text-muted-foreground">
                    John commented on your post
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-lg cursor-pointer">
                <Bell className="h-4 w-4 text-primary" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">New Like</p>
                  <p className="text-xs text-muted-foreground">
                    Sarah liked your post
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-lg cursor-pointer">
                <Bell className="h-4 w-4 text-primary" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">New Follower</p>
                  <p className="text-xs text-muted-foreground">
                    Mike started following you
                  </p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
