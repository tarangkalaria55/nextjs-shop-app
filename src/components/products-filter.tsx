"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";

interface ProductsFilterProps {
  refetchProducts: () => Promise<void>;
}

export default function ProductsFilter({
  refetchProducts,
}: ProductsFilterProps) {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10),
  );
  const [_page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearch(event.target.value);
    setPage(1);
    refetchProducts();
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setTimeout(() => {
      refetchProducts();
    }, 300);
  };

  return (
    <div className="flex justify-between gap-3">
      <div>
        <Input
          placeholder="Search"
          className="w-full"
          value={search}
          onChange={(e) => onSearchChange(e)}
        />
      </div>

      <div>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => handlePageSizeChange(value)}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Per Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="40">40</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
