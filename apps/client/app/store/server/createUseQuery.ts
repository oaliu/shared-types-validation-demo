import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";

const createUseQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) => {
  return () => useQuery<T>({ queryKey, queryFn, ...options });
};

export default createUseQuery;
