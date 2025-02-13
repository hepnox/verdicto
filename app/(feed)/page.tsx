import { Metadata } from "next";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PodcastEmptyPlaceholder } from "@/components/podcast-empy-placeholder";
import { getReportCount as getReports } from "./action";
import { AiReportSummary, Reports } from "./component";
export const metadata: Metadata = {
  title: "Reports Dashboard",
  description: "Comprehensive reporting and analytics dashboard.",
};

export default async function HomePage() {
  const report = await getReports();
  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-5">
        {/* <Sidebar playlists={playlists} className="hidden lg:block" /> */}
        <div className="col-span-5 lg:col-span-5 ">
          <div className="h-full px-4 lg:px-8">
            <Tabs defaultValue="reports" className="h-full space-y-6">
              <div className="space-between flex items-center">
                <TabsList>
                  <TabsTrigger value="reports" className="relative">
                    Reports
                    {/* <div className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {reportCount}
                    </div> */}
                  </TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  {/* <TabsTrigger value="insights" disabled>
                    Insights
                  </TabsTrigger> */}
                </TabsList>
                {/* <div className="ml-auto mr-4">
                  <Button>
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    New Report
                  </Button>
                </div> */}
              </div>
              <TabsContent
                value="reports"
                className="border-none p-0 outline-none"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Recent Reports
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Your most recent incident reports and updates.
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="relative">
                  <ScrollArea>
                    <Reports />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent
                value="analytics"
                className="h-full flex-col border-none p-0 data-[state=active]:flex"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Analytics Overview
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Key metrics and trends from your reports.
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-4">
                  <NumberCard
                    title="Total Reports"
                    value={report?.totalReports}
                    description="Reports submitted by users"
                  />
                  <NumberCard 
                    title="Today's Reports"
                    value={report?.todayReports}
                    description="Reports submitted today"
                  />
                  <NumberCard
                    title="Total Users"
                    value={report?.totalUsers}
                    description="Registered users"
                  />
                </div>

                <div>
                  <div className="col-span-3">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Report Summary
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Summary of the reports submitted.
                    </p>
                  </div>
                  <AiReportSummary json={JSON.stringify(report)} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberCard({
  title,
  value,
  description,
}: {
  title: string;
  value?: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline">
          <div className="text-3xl font-bold">
            {value?.toLocaleString() ?? "-"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
