"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BreadcrumbItem } from "@/components/layout/breadcrumb-navigation";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { getCommunity } from "@/lib/services/community/get-community";
import { getThreadBySlug } from "@/lib/services/thread/get-thread";

interface BreadcrumbData {
  community?: Community;
  thread?: Thread;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  const [breadcrumbData, setBreadcrumbData] = useState<BreadcrumbData>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBreadcrumbData = async () => {
      // Don't load data for homepage
      if (pathname === "/") {
        setBreadcrumbData({});
        return;
      }

      const segments = pathname.split("/").filter(Boolean);

      // Only load data for community and thread pages
      if (segments[0] === "communities" && segments.length >= 2) {
        setIsLoading(true);

        try {
          const communityAddress = segments[1];
          const communityResult = await getCommunity(communityAddress as `0x${string}`);

          let threadData: Thread | undefined;

          // If there's a third segment, it might be a thread slug
          if (segments.length === 3) {
            const threadSlug = segments[2];
            const threadResult = await getThreadBySlug(threadSlug);
            if (threadResult.success) {
              threadData = threadResult.thread;
            }
          }

          setBreadcrumbData({
            community: communityResult.success ? communityResult.community : undefined,
            thread: threadData,
          });
        } catch (error) {
          console.error("Failed to load breadcrumb data:", error);
          setBreadcrumbData({});
        } finally {
          setIsLoading(false);
        }
      } else {
        setBreadcrumbData({});
      }
    };

    loadBreadcrumbData();
  }, [pathname]);

  return generateBreadcrumbs(pathname, breadcrumbData, isLoading);
}

function generateBreadcrumbs(pathname: string, data: BreadcrumbData, isLoading: boolean): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  // Don't show breadcrumbs on homepage
  if (pathname === "/") {
    return [];
  }

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const isLast = i === segments.length - 1;
    const currentPath = "/" + segments.slice(0, i + 1).join("/");

    switch (segment) {
      case "communities":
        if (i === segments.length - 1) {
          // /communities
          breadcrumbs.push({
            label: "Communities",
            href: currentPath,
            isActive: isLast,
          });
        }
        break;

      case "notifications":
        breadcrumbs.push({
          label: "Notifications",
          href: currentPath,
          isActive: isLast,
        });
        break;

      case "rewards":
        breadcrumbs.push({
          label: "Rewards",
          href: currentPath,
          isActive: isLast,
        });
        break;

      case "u":
        // User profile routes
        if (segments[i + 1]) {
          breadcrumbs.push({
            label: `@${segments[i + 1]}`,
            href: `/u/${segments[i + 1]}`,
            isActive: i + 1 === segments.length - 1,
          });
          i++; // Skip the next segment as we've processed it
        }
        break;

      default:
        // Handle community and thread pages
        if (segments[i - 1] === "communities") {
          if (segments.length === 2) {
            // /communities/[address] - community page
            breadcrumbs.push({
              label: "Communities",
              href: "/communities",
            });

            const communityName = data.community?.name || (isLoading ? "Loading..." : formatAddress(segment));

            breadcrumbs.push({
              label: communityName,
              href: currentPath,
              isActive: isLast,
            });
          } else if (segments.length === 3) {
            // /communities/[address]/[thread] - thread page
            breadcrumbs.push({
              label: "Communities",
              href: "/communities",
            });

            const communityName = data.community?.name || (isLoading ? "Loading..." : formatAddress(segment));

            breadcrumbs.push({
              label: communityName,
              href: `/communities/${segment}`,
            });
          }
        } else if (segments[i - 2] === "communities" && segments.length === 3) {
          // Thread page - third segment
          const threadTitle = data.thread?.title || (isLoading ? "Loading..." : formatSlugToTitle(segment));

          breadcrumbs.push({
            label: threadTitle,
            href: currentPath,
            isActive: isLast,
          });
        } else {
          // Generic segment
          breadcrumbs.push({
            label: formatSegmentName(segment),
            href: isLast ? undefined : currentPath,
            isActive: isLast,
          });
        }
        break;
    }
  }

  return breadcrumbs;
}

// Helper functions
function formatAddress(address: string): string {
  if (address.length > 10) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  return address;
}

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatSegmentName(segment: string): string {
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
