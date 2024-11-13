import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

import {
  IApiResponse,
  IUser,
  TResetPasswordData,
  TSignInData,
  TSignUpData,
} from "@repo/shared";

const signUp = async (formData: TSignUpData) => {
  const { data } = await axiosInstance.post<IApiResponse<IUser>>(
    "/auth/sign-up",
    formData,
  );
  return data;
};

const signIn = async (formData: TSignInData) => {
  const { data } = await axiosInstance.post<IApiResponse<IUser>>(
    "/auth/sign-in",
    formData,
  );
  return data;
};

const signOut = async () => {
  const { data } = await axiosInstance.post<IApiResponse>("/auth/sign-out");
  return data;
};

const sendVerificationEmail = async () => {
  const { data } = await axiosInstance.post<IApiResponse>(
    "/auth/send-verification-email",
  );
  return data;
};

const sendPasswordResetEmail = async (email: string) => {
  const { data } = await axiosInstance.post<IApiResponse>(
    "/auth/send-password-reset-email",
    { email },
  );
  return data;
};

const resetPassword = async (fromData: TResetPasswordData) => {
  const { data } = await axiosInstance.post<IApiResponse>(
    "/auth/reset-password",
    fromData,
  );
  return data;
};

const verifyEmail = async (token: string) => {
  const { data } = await axiosInstance.post<IApiResponse>(
    "/auth/verify-email",
    {
      token,
    },
  );
  return data;
};

export const useSignUpMutation = (
  options?: UseMutationOptions<IApiResponse<IUser>, Error, TSignUpData>,
) => {
  return useMutation({
    mutationFn: signUp,
    ...options,
  });
};

export const useSignInMutation = (
  options?: UseMutationOptions<IApiResponse<IUser>, Error, TSignInData>,
) => {
  return useMutation({
    mutationFn: signIn,
    ...options,
  });
};

export const useSignOutMutation = (
  options?: UseMutationOptions<IApiResponse, Error>,
) => {
  return useMutation({
    mutationFn: signOut,
    ...options,
  });
};

export const useSendVerificationEmailMutation = (
  options?: UseMutationOptions<IApiResponse, Error>,
) => {
  return useMutation({
    mutationFn: sendVerificationEmail,
    ...options,
  });
};

export const useVerifyEmailMutation = (
  options?: UseMutationOptions<IApiResponse, Error, string>,
) => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    ...options,
  });
};

export const useSendPasswordResetEmailMutation = (
  options?: UseMutationOptions<IApiResponse, Error, string>,
) => {
  return useMutation({
    mutationFn: sendPasswordResetEmail,
    ...options,
  });
};

export const useResetPasswordMutation = (
  options?: UseMutationOptions<IApiResponse, Error, TResetPasswordData>,
) => {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
};
