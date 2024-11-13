import { toast } from "@/hooks/use-toast";
import { handleMutationError } from "@/lib/utils";
import { useSendVerificationEmailMutation } from "@/store/server/auth/mutations";

import Spinner from "@/components/common/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import SignOutButton from "./SIgnOutButton";

export default function VerifyEmailMessage() {
  const sendVerificationEmailMutation = useSendVerificationEmailMutation({
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Verification Email Sent",
        description: "Please check your email for a verification link.",
      });
    },
    onError: (error) => handleMutationError(error),
  });

  const onResend = () => {
    sendVerificationEmailMutation.mutate();
  };

  return (
    <Card className="flex w-full  max-w-[400px]">
      <CardContent className="flex flex-col items-center space-y-6 w-full">
        <Logo className="text-6xl mt-4" />
        <div className="space-y-6">
          <h1 className="text-center text-xl font-bold">
            Email Verification Required
          </h1>
          <div className="text-justify">
            To continue, please verify your email address. Check your inbox for
            a verification link and click it to complete the process. If you
            didn&apos;t receive the email, you can request a new one below .
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={onResend}
              disabled={sendVerificationEmailMutation.isPending}
              variant={"link"}
            >
              {sendVerificationEmailMutation.isPending && <Spinner />}
              Resend Verification Email
            </Button>
          </div>
        </div>
        <div className="text-sm text-center">
          <SignOutButton />
        </div>
      </CardContent>
    </Card>
  );
}
