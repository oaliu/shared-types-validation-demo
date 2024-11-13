import { useNavigate } from "@remix-run/react";

import { Button, ButtonProps } from "@/components/ui/button";

import { useSignOutMutation } from "@/store/server/auth/mutations";
import queryClient from "@/store/server/queryClient";
import Spinner from "@/components/common/Spinner";

export interface SignOutButtonProps extends ButtonProps {
  text?: string;
}

export default function SignOutButton({
  text = "Sign Out",
  ...props
}: SignOutButtonProps) {
  const navigate = useNavigate();
  const signOutMutation = useSignOutMutation({
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/");
    },
  });

  const onSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <Button
      type="button"
      onClick={onSignOut}
      disabled={signOutMutation.isPending}
      {...props}
    >
      {signOutMutation.isPending && <Spinner />}
      {text}
    </Button>
  );
}
