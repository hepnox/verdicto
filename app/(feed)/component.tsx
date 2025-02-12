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
              src={report.report_files?.[0]?.files?.url ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbBApMom33VfSzhEoxYI_xETxaPdmPa0tmbg&s'}
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
          <ContextMenuItem>View Details</ContextMenuItem>
          <ContextMenuItem>Save Report</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Mark as Important</ContextMenuItem>
          <ContextMenuItem>Add Note</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Download PDF</ContextMenuItem>
          <ContextMenuItem>Share Report</ContextMenuItem>
          <ContextMenuItem>Print Report</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Follow Case</ContextMenuItem>
          <ContextMenuItem>Report Issue</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{report.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{report.description}</p>
      </div>
    </div>
  )
}