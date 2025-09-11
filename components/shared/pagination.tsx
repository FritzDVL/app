import React from "react";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  loading?: boolean;
}

export function Pagination({ onPrev, onNext, hasPrev, hasNext, loading }: PaginationProps) {
  if (!hasPrev && !hasNext) return null;
  return (
    <nav role="navigation" aria-label="pagination" className="mx-auto mt-8 flex w-full justify-center">
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={undefined}
              className={!hasPrev || loading ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}
              onClick={e => {
                e.preventDefault();
                if (hasPrev && !loading && onPrev) onPrev();
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={undefined}
              className={!hasNext || loading ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}
              onClick={e => {
                e.preventDefault();
                if (hasNext && !loading && onNext) onNext();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </nav>
  );
}
