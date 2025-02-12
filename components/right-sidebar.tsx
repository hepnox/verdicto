"use client";

import type * as React from "react";
import { Heart, TrendingUp } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Sample data for trending and most loved posts
const trendingPosts = [
  { id: 1, title: "The Future of AI", author: "Jane Smith" },
  { id: 2, title: "Web Development in 2025", author: "John Doe" },
  { id: 3, title: "Mastering React Hooks", author: "Alice Johnson" },
];

const lovedPosts = [
  { id: 4, title: "10 Tips for Productivity", author: "Bob Williams" },
  { id: 5, title: "The Art of Clean Code", author: "Eva Brown" },
  { id: 6, title: "Understanding Blockchain", author: "Mike Davis" },
];

export function RightSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar side="right" {...props}>
      <SidebarHeader>
        <h2 className="px-4 text-lg font-semibold">Discover</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending Posts
          </SidebarGroupLabel>
          <SidebarMenu>
            {trendingPosts.map((post) => (
              <SidebarMenuItem key={post.id}>
                <SidebarMenuButton asChild>
                  <a href={`#post-${post.id}`}>
                    <span className="flex flex-col items-start">
                      <span className="font-medium">{post.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {post.author}
                      </span>
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Heart className="mr-2 h-4 w-4" />
            Most Loved Posts
          </SidebarGroupLabel>
          <SidebarMenu>
            {lovedPosts.map((post) => (
              <SidebarMenuItem key={post.id}>
                <SidebarMenuButton asChild>
                  <a href={`#post-${post.id}`}>
                    <span className="flex flex-col items-start">
                      <span className="font-medium">{post.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {post.author}
                      </span>
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
