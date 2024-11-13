import { Link, useNavigate } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { TSignInData, signInSchema } from "@repo/shared";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleMutationError } from "@/lib/utils";
import queryClient from "@/store/server/queryClient";
import queryKeys from "@/store/server/queryKeys";
import { useSignInMutation } from "@/store/server/auth/mutations";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/common/Logo";
import SubmitButton from "@/components/common/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";

export function SigninForm() {
  const navigate = useNavigate();
  const form = useForm<TSignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useSignInMutation({
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.authUser, { data: response.data });
    },
    onError: (error) => handleMutationError(error, form),
  });

  const onSubmit = (data: TSignInData) => {
    signInMutation.mutate(data);
  };

  const navigateToPasswordReset = (
    e:
      | React.MouseEvent<HTMLAnchorElement>
      | React.KeyboardEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    navigate("/forgot-password", { state: { email: form.getValues("email") } });
  };

  return (
    <Card className="flex w-full  max-w-[400px]">
      <CardContent className="flex flex-col items-center space-y-6 w-full">
        <Logo className="text-6xl mt-4" />
        <div className="text-center">
          <h1 className="text-center text-2xl font-bold">Welcome Back!</h1>
          <div className="text-sm">
            New around here? <Link to="/sign-up">Create an account</Link> and
            join us!
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Enter the email you used to register.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Your secret key to access your account.
                  </FormDescription>
                </FormItem>
              )}
            />
            <SubmitButton
              type="submit"
              className="w-full space-y-6"
              text="Sign in"
              loadingText="Signing in..."
              processing={signInMutation.isPending}
              disabled={signInMutation.isPending}
            ></SubmitButton>
          </form>
        </Form>

        <div className="text-sm text-center">
          <div className="mb-1 font-medium">Forgot your password?</div>
          No worries!{" "}
          <Link onClick={navigateToPasswordReset} to="">
            Reset it here.
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
