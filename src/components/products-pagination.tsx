"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { refetchCachedProducts } from "@/server/refetch-cached-products";
import { Button } from "./ui/button";

export default function ProductsPagination() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [totalPage] = useQueryState("totalPage", parseAsInteger.withDefault(1));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      refetchCachedProducts();
    }, 100);
  };

  if (totalPage <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
              >
                {page - 1}
              </Button>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <Button variant="outline" disabled>
            {page}
          </Button>
        </PaginationItem>

        {page < totalPage && (
          <>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
