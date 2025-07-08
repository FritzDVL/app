import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function ThreadRepliesPagination({
  pageInfo,
  onPrev,
  onNext,
}: {
  pageInfo: any;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!pageInfo) return null;
  return (
    <Pagination className="my-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={onPrev}
            aria-disabled={!pageInfo.prev}
            tabIndex={!pageInfo.prev ? -1 : 0}
            className={!pageInfo.prev ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={onNext}
            aria-disabled={!pageInfo.next}
            tabIndex={!pageInfo.next ? -1 : 0}
            className={!pageInfo.next ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
