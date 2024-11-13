import { axiosInstance } from "@/lib/axios";

import queryKeys from "@/store/server/queryKeys";
import createUseQuery from "@/store/server/createUseQuery";

import { IApiResponse, IUser } from "@repo/shared";

type AuthUserResponse = IApiResponse<IUser>;

const getAuthUser = async (): Promise<AuthUserResponse> => {
  const { data } = await axiosInstance.get<AuthUserResponse>("/auth");

  return data;
};

// TODO: should receive oprtions from caller
export const useAuthUserQuery = createUseQuery(
  queryKeys.authUser,
  getAuthUser,
  {
    retry: false,
  },
);
