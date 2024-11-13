import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import axios, { AxiosError } from "axios";

import { IApiError } from "@repo/shared";
import { toast } from "@/hooks/use-toast";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
});

// Add CSRF Token to Headers
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("xsrf-token="))
    ?.split("=")[1];

  if (csrfToken) {
    config.headers["x-csrf-token"] = csrfToken;
  }

  return config;
});

export function axiosErrorHandler<T extends FieldValues>(
  error: AxiosError,
  form?: UseFormReturn<T, unknown, undefined>,
) {
  const { message, validationErrors } = pasrseAxiosError(error);

  if (form && validationErrors) {
    Object.keys(validationErrors).forEach((field) => {
      form.setError(field as Path<T>, {
        type: "manual",
        message: validationErrors[field],
      });
    });

    return;
  }

  toast({
    variant: "destructive",
    title: message,
  });
}

export function pasrseAxiosError(error: AxiosError): IApiError {
  const { request, response } = error;

  // Server responded with a status code outside the 2xx range
  if (response) {
    const data = response.data as IApiError;

    return data;
  }

  // Request was made but no response received (e.g., network issues)
  if (request) {
    return {
      status: 503,
      name: "NetworkError",
      message: "Network Error",
    };
  }

  // Error occurred in setting up the request
  return {
    status: 500,
    name: "UnknownError",
    message: "Something went wrong! Try again",
  };
}
