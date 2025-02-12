import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
export function PodcastEmptyPlaceholder() {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-10 w-10 text-muted-foreground"
          viewBox="0 0 24 24"
        >
          <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V11.08z" />
          <path d="M14 3v5h5" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="15" y2="17" />
        </svg>

        <h3 className="mt-4 text-lg font-semibold">No Crime Reports</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You haven&apos;t filed any crime reports yet. Add one below.
        </p>
        <Dialog>
          {/* <DialogTrigger asChild> */}
          <Link href="/post">
            <Button size="sm" className="relative">
              File New Report
            </Button>
          </Link>
          {/* </DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>File Crime Report</DialogTitle>
              <DialogDescription>
                Enter the details of the incident to file a new report.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="incident">Incident Description</Label>
                <Input id="incident" placeholder="Describe the incident..." />
              </div>
            </div>
            <DialogFooter>
              <Button>Submit Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}