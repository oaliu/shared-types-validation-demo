import { useForm } from "react-hook-form";
import { useNavigate } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPasswordSchema, TForgotPasswordData } from "@repo/shared";
import { Logo } from "@/components/common/Logo";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SubmitButton from "@/components/common/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IoIosArrowRoundBack } from "react-icons/io";

import { toast } from "@/hooks/use-toast";
import { handleMutationError } from "@/lib/utils";

import { useSendPasswordResetEmailMutation } from "@/store/server/auth/mutations";
import { Button } from "@/components/ui/button";

interface Props {
  email?: string;
}
export default function ForgotPasswordForm({ email = "" }: Props) {
  const navigate = useNavigate();
  const form = useForm<TForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email,
    },
  });

  const sendPasswordResetEmailMutation = useSendPasswordResetEmailMutation({
    onSuccess: () => {
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for a reset link.",
      });
    },
    onError: (error) => handleMutationError(error, form),
  });

  const onSubmit = (data: TForgotPasswordData) => {
    sendPasswordResetEmailMutation.mutate(data.email);
  };

  const backToSingnIn = () => {
    navigate("/sign-in");
  };

  return (
    <Card className="flex w-full max-w-[400px]">
      <CardContent className="flex flex-col items-center space-y-6 w-full">
        <Logo className="text-6xl mt-4" />
        <div className="text-center">
          <h1 className="text-center text-2xl font-bold">
            Forgot your password?
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
            <SubmitButton
              type="submit"
              className="w-full space-y-6"
              text="Send Reset Link"
              loadingText="Sending..."
              processing={sendPasswordResetEmailMutation.isPending}
              disabled={sendPasswordResetEmailMutation.isPending}
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
