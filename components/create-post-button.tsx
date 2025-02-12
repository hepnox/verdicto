import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function CreatePostButton() {
  return (
    <Button asChild variant="default" size="sm">
      <Link href="/post" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        <span>Create Post</span>
      </Link>
    </Button>
  );
}
