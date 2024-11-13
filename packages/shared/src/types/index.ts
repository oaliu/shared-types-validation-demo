export interface IApiResponse<T = undefined> {
  message?: string;
  data?: T;
}

export interface IApiError {
  status: number;
  name: string;
  message: string;
  validationErrors?: Record<string, string>;
}

export type TWithoutTimestamps<T> = Omit<T, "_id" | "createdAt" | "updatedAt">;

export interface IUser {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
