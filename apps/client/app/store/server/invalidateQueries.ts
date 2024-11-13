import queryClient from "@/store/server/queryClient";

const invalidateQueries = (key: string[]) => {
  queryClient.invalidateQueries({
    queryKey: key,
  });
};

export default invalidateQueries;
