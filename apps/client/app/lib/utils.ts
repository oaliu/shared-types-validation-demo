import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

import { axiosErrorHandler } from "@/lib/axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleMutationError<T extends FieldValues>(
  error: Error,
  form?: UseFormReturn<T, unknown, undefined>,
  callback?: () => void,
): void {
  if (error instanceof AxiosError) {
    axiosErrorHandler(error, form);
  } else {
    toast({
      variant: "destructive",
      title: "Something went wrong!",
      description: error.message || "An unexpected error occurred.",
    });

    console.error(error);
  }

  if (callback) {
    callback();
  }
}

export function convertValidationErrorsToObject(validationErrors: {
  [key: string]: string[];
}): { [key: string]: unknown } {
  const result: { [key: string]: unknown } = {};

  for (const key in validationErrors) {
    if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
      // Split the key by dot notation to create a nested structure
      const keys = key.split(".");
      let currentObj: { [key: string]: unknown } = result;

      for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i] as keyof typeof currentObj;

        // If the current key doesn't exist, create it
        if (!currentObj[currentKey]) {
          if (i === keys.length - 1) {
            // If it's the last key, set the value
            currentObj[currentKey] = validationErrors[key];
          } else {
            // If not the last key, create an empty object
            currentObj[currentKey] = {};
          }
        }

        // Move deeper into the nested object
        currentObj = currentObj[currentKey] as { [key: string]: unknown };
      }
    }
  }

  return result;
}
