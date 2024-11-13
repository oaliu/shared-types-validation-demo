import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";

import { Logo } from "@/components/common/Logo";
import SubmitButton from "@/components/common/SubmitButton";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { resetPasswordSchema, TResetPasswordData } from "@repo/shared";
import { useResetPasswordMutation } from "@/store/server/auth/mutations";
import { toast } from "@/hooks/use-toast";
import { handleMutationError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function ResetPasswordFrom({ token }: { token: string }) {
  const navigate = useNavigate();
  const form = useForm<TResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });
  const resetPasswordMutation = useResetPasswordMutation({
    onSuccess: () => {
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully.",
      });

      navigate("/sign-in");
    },
    onError: (error) => handleMutationError(error, form),
  });

  const onSubmit = (data: TResetPasswordData) => {
    resetPasswordMutation.mutate(data);
  };

  const backToSingnIn = () => {
    navigate("/sign-in");
  };

  return (
    <Card className="flex w-full  max-w-[400px]">
      <CardContent className="flex flex-col items-center space-y-6 w-full">
        <Logo className="text-6xl mt-4" />
        <div className="text-center">
          <h1 className="text-center text-2xl font-bold">
            Reset your password
          </h1>
          <div>We&apos;ll help you reset it.</div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
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
                    Just to make sure you&apos;ve got it right!
                  </FormDescription>
                </FormItem>
              )}
            />
            <SubmitButton
              type="submit"
              className="w-full space-y-6"
              text="Send Reset Link"
              loadingText="Sending..."
              processing={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending}
            ></SubmitButton>
          </form>
        </Form>
        <div className="text-sm text-center">
          <Button onClick={backToSingnIn} variant={"ghost"}>
            <IoIosArrowRoundBack />
            Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
