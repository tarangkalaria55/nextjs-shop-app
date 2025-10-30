import type { SearchParams } from "nuqs/server";
import type { AppRoutes } from "../../.next/types/routes";

export type NuqsPageProps<AppRoute extends AppRoutes> = Omit<
  PageProps<AppRoute>,
  "searchParams"
> & {
  searchParams: Promise<SearchParams>;
};
