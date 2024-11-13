import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

export function createMutationHook<TData, TVariables>(
  endpoint: string,
  options?: UseMutationOptions<TData, Error, TVariables>,
) {
  return () =>
    useMutation({
      mutationFn: (data: TVariables) =>
        axiosInstance
          .post<TData>(endpoint, data)
          .then((response) => response.data),
      ...options,
    });
}
