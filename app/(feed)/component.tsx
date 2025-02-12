'use client';

import { playlists } from "@/components/album-artwork";
import { useQuery } from "@tanstack/react-query";
import { getCrimeReports } from "./action";
export function Reports() {
    const reportsQuery = useQuery({
        queryKey: ['reports'],
        queryFn: getCrimeReports
    })

    if (reportsQuery.isLoading) return <div>Loading...</div>
    if (reportsQuery.isError) return <div>Error: {reportsQuery.error.message}</div>

    const reports = reportsQuery.data;
    console.log(reports);
    return (
        <div className="flex space-x-4 pb-4">
        {reports?.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            className="w-[250px]"
            aspectRatio="portrait"
            width={250}
            height={330}
          />
        ))}
      </div>
    )
}


import { PlusCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";


interface ReportCardProps extends React.HTMLAttributes<HTMLDivElement> {
  report: Awaited<ReturnType<typeof getCrimeReports>>[number]
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

function ReportCard({
  report,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: ReportCardProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md h-[300px] w-[200px]">
            <Image
              src={report.report_files[0].files.url}
              alt={report.title}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Add to Library</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
              {playlists.map((playlist) => (
                <ContextMenuItem key={playlist}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                  </svg>
                  {playlist}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Play Later</ContextMenuItem>
          <ContextMenuItem>Create Station</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{report.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{report.description}</p>
      </div>
    </div>
  )
}