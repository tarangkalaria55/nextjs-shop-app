"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";

interface PaginationStateManagerProps {
  totalCount: number;
  pageSize: number;
}

export default function PaginationStateManager({
  totalCount,
  pageSize,
}: PaginationStateManagerProps) {
  const [_totalPage, setTotalPage] = useQueryState(
    "totalPage",
    parseAsInteger.withDefault(1),
  );

  useEffect(() => {
    setTotalPage(Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize, setTotalPage]);

  return null;
}
