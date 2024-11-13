import { Link } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TSignUpData, signUpSchema } from "@repo/shared";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/common/Logo";
import SubmitButton from "@/components/common/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";

import queryClient from "@/store/server/queryClient";
import queryKeys from "@/store/server/queryKeys";
import { useSignUpMutation } from "@/store/server/auth/mutations";

import { handleMutationError } from "@/lib/utils";

export default function SignupForm() {
  const form = useForm<TSignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAgreement: false,
    },
  });

  const signUpMutation = useSignUpMutation({
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.authUser, { data: response.data });
    },
    onError: (error) => handleMutationError(error, form),
  });

  const onSubmit = (data: TSignUpData) => {
    signUpMutation.mutate(data);
  };

  return (
    <Card className="flex w-full  max-w-[400px]">
      <CardContent className="flex flex-col items-center space-y-6 w-full">
        <Logo className="text-6xl mt-4" />
        <div className="text-center">
          <h1 className="text-center text-2xl font-bold">
            Create Your New Account
          </h1>
          <div className="text-sm">
            Welcome back? <Link to="/sign-in">Sign in here</Link> to continue!
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Let us know who you are!</FormDescription>
                </FormItem>
              )}
            />
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
                    Your key to access all the exciting features.
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
                    Make it strong, make it secure
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Your Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Just to make sure you’ve got it right!
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="termsAgreement"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-2">
                  <div className="flex w-full items-center justify-start gap-2">
                    <FormControl>
                      <div className="flex h-6 items-center">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none">
                      I agree to the{" "}
                      <Link to="/terms" className="font-semibold">
                        terms and conditions
                      </Link>
                    </FormLabel>
                  </div>
                  <FormDescription>
                    By signing up, you&apos;re agreeing to our terms—don&apos;t
                    worry, we&apos;ve got your back!
                  </FormDescription>
                </FormItem>
              )}
            />
            <SubmitButton
              type="submit"
              className="w-full space-y-6"
              text="Sign up"
              loadingText="Signing up..."
              processing={signUpMutation.isPending}
              disabled={signUpMutation.isPending}
            ></SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
