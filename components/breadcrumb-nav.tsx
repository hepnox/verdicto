"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { kebabToTitle } from "@/helpers/text";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter((segment) => segment)
    .map((segment) => ({
      label: kebabToTitle(segment),
      href: segment,
    }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <div key={segment.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {index === segments.length - 1 ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={`/${segments
                    .slice(0, index + 1)
                    .map((s) => s.href)
                    .join("/")}`}
                >
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
