import { Separator } from "@radix-ui/react-separator";
import { CreatePostButton } from "./create-post-button";
import { SidebarTrigger } from "./ui/sidebar";
import { BreadcrumbNav } from "./breadcrumb-nav";

export const TopBar = () => {
  return (
    <div className="w-full flex items-center justify-between gap-2 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbNav />
      </div>
      <CreatePostButton />
    </div>
  );
};
