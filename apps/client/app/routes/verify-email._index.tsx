import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

import { useAuthUserQuery } from "@/store/server/auth/queries";

import VerifyEmailMessage from "@/components/auth/VerifyEmailMessage";
import PageLoader from "@/components/common/PageLoader";
import { ModeToggle } from "@/components/common/ModeToggle";

export default function SendEmailVerificationPage() {
  const navigate = useNavigate();
  const authuserQuery = useAuthUserQuery();
  const { data: authUser } = authuserQuery.data || {};

  useEffect(() => {
    if (authuserQuery.isLoading) {
      return;
    }

    if (!authUser) {
      navigate("/sign-in");
    }

    if (authUser?.isVerified) {
      navigate("/dashboard");
    }
  }, [authUser, navigate, authuserQuery.isLoading]);

  if (authuserQuery.isLoading) {
    return <PageLoader />;
  } else if (!authUser) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col min-h-dvh items-center">
      <div className="flex w-full justify-end gap-2 p-2 mb-auto">
        <ModeToggle />
      </div>
      <div className="flex flex-1 w-full justify-center items-center pb-10">
        <VerifyEmailMessage />
      </div>
    </div>
  );
}
